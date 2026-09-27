use don_core::{DonServer, axum::Router};
use don_core::traits::DonAuthHooks;
use validator::Validate; 
use don_macros::DonAuth;
use serde::{Deserialize, Serialize};


#[derive(Debug, Clone, Serialize, Deserialize, don_core::sqlx::FromRow, DonAuth, Validate)]
#[don_auth_key = "username"] 
#[don_validate] 
pub struct User {
    pub id: i32,
    
    #[validate(length(min = 3, message = "Username must be at least 3 characters!"))]
    pub username: String,
    
    #[validate(length(min = 6, message = "Password must be at least 6 characters!"))]
    pub password: String,
    
    #[validate(range(min = 18, message = "You must be 18+ to signup!"))]
    pub age: i32,
    
    pub city: String,
    pub role: String,
}


impl DonAuthHooks for User {
    
   
    async fn before_signup(&mut self) -> Result<(), String> {
        
        self.city = self.city.trim().to_uppercase();
        Ok(())
    }

    
    async fn before_login(primary_key: &str) -> Result<(), String> {
        
        if primary_key == "banned_hacker" {
            return Err("Security Alert: Your account has been suspended!".to_string());
        }
        Ok(())
    }
}


#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    println!("Starting Don Framework with Validation & Hooks...");

    DonServer::new()
        .port(8080)
        .auth_key("username") 
        .with_routes(User::get_auth_routes())
        .start()
        .await
        .expect("Server crashed!");
}
