import os
import time
import openpyxl
from typing import List, Dict, Any, Optional

# Default path to the XLSX file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_XLSX_PATH = os.path.join(BASE_DIR, "frontend", "public", "tamilmedictionary_terms.xlsx")

class ExcelDictionaryService:
    def __init__(self, file_path: str = DEFAULT_XLSX_PATH):
        self.file_path = file_path
        self._terms: List[Dict[str, Any]] = []
        self._categories: List[str] = []
        self._last_mtime: float = 0
        self._loaded: bool = False

    def is_file_available(self) -> bool:
        return os.path.exists(self.file_path)

    def _clean_text(self, val: Any) -> str:
        if val is None:
            return ""
        s = str(val).strip()
        # Clean leading single quote artifact if present (e.g., "'Geneva Convention" -> "Geneva Convention")
        if s.startswith("'") and len(s) > 1 and not s.startswith("''"):
            s = s[1:].strip()
        return s

    def load_if_needed(self, force: bool = False) -> None:
        if not self.is_file_available():
            self._terms = []
            self._categories = []
            self._loaded = False
            return

        try:
            mtime = os.path.getmtime(self.file_path)
            if not force and self._loaded and mtime == self._last_mtime:
                return

            # Load workbook
            wb = openpyxl.load_workbook(self.file_path, data_only=True, read_only=True)
            sheet = wb.active

            terms: List[Dict[str, Any]] = []
            categories_set = set()

            rows_iter = sheet.iter_rows(values_only=True)
            try:
                header = next(rows_iter)
            except StopIteration:
                header = []

            # Determine column indexes
            col_map = {}
            for idx, col in enumerate(header or []):
                col_name = str(col or "").strip().lower()
                col_map[col_name] = idx

            idx_en = col_map.get("en_term", 0)
            idx_ta = col_map.get("ta_term", 1)
            idx_cat = col_map.get("category", 2)
            idx_def = col_map.get("definition", 3)
            idx_tadef = col_map.get("ta_definition", 4)
            idx_tags = col_map.get("tags", 5)
            idx_feat = col_map.get("is_featured", 6)

            row_num = 1
            for row in rows_iter:
                row_num += 1
                if not row or not any(row):
                    continue

                def get_val(idx):
                    return row[idx] if idx < len(row) else None

                en_val = self._clean_text(get_val(idx_en))
                ta_val = self._clean_text(get_val(idx_ta))
                
                # Skip rows with completely empty terms
                if not en_val and not ta_val:
                    continue

                cat_val = self._clean_text(get_val(idx_cat)) or "General"
                categories_set.add(cat_val)

                def_val = self._clean_text(get_val(idx_def))
                ta_def_val = self._clean_text(get_val(idx_tadef))

                tags_raw = get_val(idx_tags)
                if isinstance(tags_raw, list):
                    tags_list = [str(t).strip() for t in tags_raw if str(t).strip()]
                elif tags_raw is not None:
                    tags_str = str(tags_raw).strip()
                    tags_list = [t.strip() for t in tags_str.split(",") if t.strip()] if tags_str else []
                else:
                    tags_list = []

                feat_raw = str(get_val(idx_feat) or "").strip().lower()
                is_featured = feat_raw in ("true", "1", "yes")

                term_dict = {
                    "id": f"xlsx_{row_num}",
                    "en_term": en_val,
                    "ta_term": ta_val,
                    "category": cat_val,
                    "definition": def_val,
                    "ta_definition": ta_def_val,
                    "tags": tags_list,
                    "is_featured": is_featured,
                }
                terms.append(term_dict)

            wb.close()
            self._terms = terms
            self._categories = sorted([c for c in categories_set if c])
            self._last_mtime = mtime
            self._loaded = True
            print(f"📊 Loaded {len(self._terms)} terms and {len(self._categories)} categories from {self.file_path}")
        except Exception as e:
            print(f"⚠️ Error loading XLSX dictionary from {self.file_path}: {e}")

    def get_categories(self) -> List[str]:
        self.load_if_needed()
        return self._categories

    def search_terms(
        self,
        q: str = "",
        page: int = 1,
        limit: int = 20,
        category: Optional[str] = None,
        featured: Optional[bool] = None,
    ) -> Dict[str, Any]:
        self.load_if_needed()

        filtered = self._terms

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
                definition_lower = t["definition"].lower()
                ta_def_lower = t["ta_definition"].lower()
                tags_lower = [tag.lower() for tag in t["tags"]]

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

            # Combined ranked results
            matched_terms = exact_matches + prefix_matches + word_matches + sub_matches
        else:
            # Sort alphabetically by English term
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
            q="",
            page=page,
            limit=limit,
            category=category,
            featured=featured,
        )


# Global singleton instance
excel_dictionary = ExcelDictionaryService()
