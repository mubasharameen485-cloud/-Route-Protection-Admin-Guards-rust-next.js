
use don_core::{
    DonServer, AppState, DonAuthHooks, DonAdmin, 
    axum::{Router, extract::{State, Path}, Json, routing::{get, put}},
    sqlx::Row 
};
use don_macros::DonAuth;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, don_core::sqlx::FromRow, DonAuth)]
#[don_auth_key = "username"] 
pub struct User {
    pub id: i32,
    pub username: String,
    pub password: String,
    pub role: String,
    pub is_suspended: bool, 
}

impl DonAuthHooks for User {}

// ==========================================
// ADMIN HANDLERS
// ==========================================

// A. Get All Users
async fn get_all_users(
    _admin: DonAdmin,
    State(state): State<AppState>,
) -> Result<Json<Vec<User>>, String> {
    let users = don_core::sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY id ASC")
        .fetch_all(&state.db)
        .await
        .map_err(|e| e.to_string())?;

    Ok(Json(users))
}

// B. Toggle Suspend / Unsuspend (THE FIX!)
async fn toggle_suspend_user(
    _admin: DonAdmin,
    State(state): State<AppState>,
    Path(user_id): Path<i32>,
) -> Result<Json<don_core::serde_json::Value>, String> {
    
    
    let row = don_core::sqlx::query(
        "UPDATE users SET is_suspended = NOT is_suspended WHERE id = $1 RETURNING is_suspended"
    )
    .bind(user_id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| e.to_string())?;

    let is_suspended: bool = row.try_get("is_suspended").unwrap_or(false);
    let status_msg = if is_suspended { "suspended" } else { "activated" };

    Ok(Json(don_core::serde_json::json!({
        "success": true,
        "is_suspended": is_suspended,
        "message": format!("User ID {} has been {} successfully!", user_id, status_msg)
    })))
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    println!("Starting Don Framework with Admin Logic...");

    let admin_routes = Router::new()
        .route("/admin/users", get(get_all_users))
        .route("/admin/suspend/:id", put(toggle_suspend_user)); // Toggle function 

    DonServer::new()
        .port(8080)
        .auth_key("username")
        .with_routes(User::get_auth_routes())
        .with_routes(admin_routes)
        .start()
        .await
        .expect("Server crashed!");
}