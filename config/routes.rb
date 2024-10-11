Rails.application.routes.draw do

  # root 'plaid#index'

  # # Plaid routes
  # resources :plaid, only: [:index] do
  #   collection do
  #     post 'create_link_token'
  #     post 'exchange_public_token'
  #     get 'accounts'
  #     get 'connection_status'
  #   end
  # end

  root 'plaid#index'
  post 'plaid/create_link_token', to: 'plaid#create_link_token'
  post 'plaid/exchange_public_token', to: 'plaid#exchange_public_token'
  get '/plaid/accounts', to: 'plaid#accounts'
  get '/plaid/transactions', to: 'plaid#transactions'
  get '/plaid/connection_status', to: 'plaid#connection_status'

   # Auth routes
   post "/auth/register", to: "auth#register"
   post "/auth/login", to: "auth#login"
   post "/auth/logout", to: "auth#logout"
   put "/auth/profile", to: "auth#update_profile"
   put "/auth/password", to: "auth#update_password"
   get '/auth/status', to: 'auth#check_auth_status'

  # Existing user routes
  post "/users", to: "users#create"
  get "/me", to: "users#me"
  get "/users", to: "users#index"  # Added get users route

  # API routes for authentication
  # namespace :api do
  #   namespace :auth do
  #     post 'register', to: 'registrations#create'   # Route for user registration
  #     post 'login', to: 'sessions#create'           # Route for user login
  #     # Add any other auth-related routes as needed
  #   end
  # end

  get '/csrf_token', to: 'application#csrf_token'
end
