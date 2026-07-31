from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from ..database import get_db
from ..security import verify_password, create_access_token, create_refresh_token, decode_token, get_current_admin
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Auth"])


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    username: str
    role: str


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_db()
    user = await db.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token({"sub": user["username"]})
    refresh_token = create_refresh_token({"sub": user["username"]})
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        username=user["username"],
        role=user.get("role", "admin"),
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(body: RefreshRequest):
    payload = decode_token(body.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    username = payload.get("sub")
    db = get_db()
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    access_token = create_access_token({"sub": username})
    new_refresh = create_refresh_token({"sub": username})
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh,
        username=username,
        role=user.get("role", "admin"),
    )


@router.get("/me")
async def me(current_user=Depends(get_current_admin)):
    return {
        "username": current_user["username"],
        "email": current_user.get("email", ""),
        "role": current_user.get("role", "admin"),
    }
