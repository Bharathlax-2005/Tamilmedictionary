import os
import json
import urllib.request
import urllib.parse
import ssl
from typing import List, Dict, Any, Optional
from .excel_service import excel_dictionary

DEFAULT_SHEET_ID = "1w2Fag9-HZoWU-B-Sht3FRiaUx62o54fec84jdkbMPXY"
DEFAULT_GID = "872450278"

class GoogleSheetDictionaryService:
    def __init__(self):
        self.appscript_url = os.getenv("GOOGLE_APPSCRIPT_URL", "")
        self.sheet_id = os.getenv("GOOGLE_SHEET_ID", DEFAULT_SHEET_ID)
        self.gid = os.getenv("GOOGLE_SHEET_GID", DEFAULT_GID)
        self._cached_terms: List[Dict[str, Any]] = []
        self._categories: List[str] = []
        self._last_fetch_time: float = 0
        self.cache_file = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "frontend", "public", "google_sheet_terms_cache.json"
        )

    def set_appscript_url(self, url: str):
        self.appscript_url = url.strip()

    def fetch_from_appscript(self, url: str) -> List[Dict[str, Any]]:
        """Fetch JSON data from Google Apps Script Web App with redirect handling."""
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Accept": "application/json, text/plain, */*"
            }
        )
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        with urllib.request.urlopen(req, context=ctx, timeout=30) as response:
            raw_data = response.read().decode("utf-8")
            data = json.loads(raw_data)
            return data

    def sync(self, custom_url: Optional[str] = None) -> Dict[str, Any]:
        """Fetch fresh terms from Google Apps Script or Sheet and update in-memory cache & file."""
        target_url = (custom_url or self.appscript_url or "").strip()
        
        terms: List[Dict[str, Any]] = []
        source_type = "none"

        if target_url:
            try:
                raw_items = self.fetch_from_appscript(target_url)
                source_type = "appscript"
                categories_set = set()

                for idx, item in enumerate(raw_items, start=1):
                    en_term = str(item.get("en_term", item.get("English", "")) or "").strip()
                    ta_term = str(item.get("ta_term", item.get("Tamil", "")) or "").strip()
                    if not en_term and not ta_term:
                        continue

                    # Clean leading single quote
                    if en_term.startswith("'") and len(en_term) > 1 and not en_term.startswith("''"):
                        en_term = en_term[1:].strip()

                    cat = str(item.get("category", item.get("Category", "General")) or "General").strip() or "General"
                    categories_set.add(cat)
                    
                    definition = str(item.get("definition", item.get("Definition", "")) or "").strip()
                    ta_def = str(item.get("ta_definition", item.get("Tamil Definition", "")) or "").strip()
                    tags_raw = item.get("tags", item.get("Tags", []))
                    if isinstance(tags_raw, list):
                        tags_list = [str(t).strip() for t in tags_raw if str(t).strip()]
                    elif tags_raw:
                        tags_list = [t.strip() for t in str(tags_raw).split(",") if t.strip()]
                    else:
                        tags_list = []

                    feat_raw = str(item.get("is_featured", item.get("Featured", "false"))).strip().lower()
                    is_featured = feat_raw in ("true", "1", "yes")

                    terms.append({
                        "id": f"gs_{idx}",
                        "en_term": en_term,
                        "ta_term": ta_term,
                        "category": cat,
                        "definition": definition,
                        "ta_definition": ta_def,
                        "tags": tags_list,
                        "is_featured": is_featured,
                    })

                if terms:
                    self._cached_terms = terms
                    self._categories = sorted([c for c in categories_set if c])
                    # Save to local cache file
                    try:
                        with open(self.cache_file, "w", encoding="utf-8") as f:
                            json.dump(self._cached_terms, f, ensure_ascii=False, indent=2)
                    except Exception as e:
                        print(f"Warning: Could not save google sheet cache file: {e}")

                    return {
                        "success": True,
                        "source": "google_appscript",
                        "total_terms": len(self._cached_terms),
                        "categories_count": len(self._categories)
                    }
            except Exception as e:
                print(f"Error fetching from Google Apps Script: {e}")

        # If Apps Script is not configured or failed, check local JSON cache or local XLSX
        if not self._cached_terms and os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    self._cached_terms = json.load(f)
                cats = set(t.get("category", "General") for t in self._cached_terms)
                self._categories = sorted([c for c in cats if c])
                return {
                    "success": True,
                    "source": "local_cache",
                    "total_terms": len(self._cached_terms),
                    "categories_count": len(self._categories)
                }
            except Exception:
                pass

        # Fallback to local XLSX dictionary
        if not self._cached_terms and excel_dictionary.is_file_available():
            excel_dictionary.load_if_needed()
            return {
                "success": True,
                "source": "local_xlsx_fallback",
                "total_terms": len(excel_dictionary._terms),
                "categories_count": len(excel_dictionary._categories)
            }

        return {
            "success": False,
            "message": "No Google Apps Script URL provided and cache is empty."
        }

    def search_terms(
        self,
        q: str = "",
        page: int = 1,
        limit: int = 20,
        category: Optional[str] = None,
        featured: Optional[bool] = None,
    ) -> Dict[str, Any]:
        if not self._cached_terms:
            self.sync()

        if not self._cached_terms:
            # Fall back to local excel dictionary
            return excel_dictionary.search_terms(
                q=q, page=page, limit=limit, category=category, featured=featured
            )

        filtered = self._cached_terms

        # 1. Filter by category
        if category:
            cat_lower = category.strip().lower()
            filtered = [t for t in filtered if t["category"].lower() == cat_lower]

        # 2. Filter by featured
        if featured is not None:
            filtered = [t for t in filtered if t["is_featured"] is featured]

        # 3. Search query filtering & ranking
        q_clean = (q or "").strip()
        if q_clean:
            q_lower = q_clean.lower()
            exact_matches = []
            prefix_matches = []
            word_matches = []
            sub_matches = []

            for t in filtered:
                en = t["en_term"]
                ta = t["ta_term"]
                en_lower = en.lower()
                ta_lower = ta.lower()
                definition_lower = t.get("definition", "").lower()
                ta_def_lower = t.get("ta_definition", "").lower()
                tags_lower = [tag.lower() for tag in t.get("tags", [])]

                # Match checks
                is_exact = (en_lower == q_lower) or (ta_lower == q_lower)
                if is_exact:
                    exact_matches.append(t)
                    continue

                is_prefix = en_lower.startswith(q_lower) or ta_lower.startswith(q_lower)
                if is_prefix:
                    prefix_matches.append(t)
                    continue

                is_word_match = any(w.startswith(q_lower) for w in en_lower.split()) or any(w.startswith(q_lower) for w in ta_lower.split())
                if is_word_match:
                    word_matches.append(t)
                    continue

                is_sub = (
                    q_lower in en_lower
                    or q_lower in ta_lower
                    or q_lower in definition_lower
                    or q_lower in ta_def_lower
                    or any(q_lower in tag for tag in tags_lower)
                    or q_lower in t["category"].lower()
                )
                if is_sub:
                    sub_matches.append(t)

            matched_terms = exact_matches + prefix_matches + word_matches + sub_matches
        else:
            matched_terms = sorted(filtered, key=lambda x: x["en_term"].lower())

        total = len(matched_terms)
        skip = (page - 1) * limit
        paginated = matched_terms[skip : skip + limit]
        pages = (total + limit - 1) // limit if total > 0 else 1

        return {
            "results": paginated,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages,
        }

    def list_terms(
        self,
        page: int = 1,
        limit: int = 20,
        category: Optional[str] = None,
        featured: Optional[bool] = None,
    ) -> Dict[str, Any]:
        return self.search_terms(
            q="", page=page, limit=limit, category=category, featured=featured
        )

    def get_categories(self) -> List[str]:
        if not self._categories:
            self.sync()
        if not self._categories:
            return excel_dictionary.get_categories()
        return self._categories


google_sheet_dictionary = GoogleSheetDictionaryService()
