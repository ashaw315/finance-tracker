class PlaidController < ApplicationController
    before_action :authorized  # Assuming this method is defined in your ApplicationController
    # protect_from_forgery with: :null_session # to handle CSRF protection for API requests
  
    def index
    end
  
    def create_link_token
      client = Rails.application.config.plaid_client
      puts "Full Plaid client configuration:"
      puts client.api_client.config.inspect
      Rails.logger.info "Plaid Configuration in Controller:"
      Rails.logger.info "Server Index: #{client.api_client.config.server_index}"
      Rails.logger.info "Host: #{client.api_client.config.host}"
      Rails.logger.info "Client ID: #{client.api_client.config.api_key['PLAID-CLIENT-ID']}"
      Rails.logger.info "Secret (first 4 chars): #{client.api_client.config.api_key['PLAID-SECRET'][0..3]}"
      
      link_token_params = {
        user: { client_user_id: current_user.id.to_s },
        client_name: 'Your App Name',
        products: ['auth'],
        country_codes: ['US'],
        language: 'en'
      }
      Rails.logger.info "Link token params: #{link_token_params.inspect}"

      begin
        link_token_response = client.link_token_create(link_token_params)
        Rails.logger.info "Link token response: #{link_token_response.inspect}"
        render json: { link_token: link_token_response.link_token }
      rescue Plaid::ApiError => e
        error_response = JSON.parse(e.response_body)
        Rails.logger.error "Plaid API Error: #{error_response.inspect}"
        Rails.logger.error "Plaid API Error Backtrace: #{e.backtrace.join("\n")}"
        error_message = error_response['error_message'] if error_response.is_a?(Hash)
        render json: { error: error_message || 'An error occurred with the Plaid API' }, status: :bad_request
      rescue StandardError => e
        Rails.logger.error "Unexpected error: #{e.message}"
        Rails.logger.error "Unexpected error backtrace: #{e.backtrace.join("\n")}"
        render json: { error: e.message }, status: :internal_server_error
      end
    rescue Plaid::ApiError => e
      error_response = JSON.parse(e.response_body)
      error_message = error_response['error_message'] if error_response.is_a?(Hash)
      render json: { error: error_message || 'An error occurred with the Plaid API' }, status: :bad_request
    rescue StandardError => e
      render json: { error: e.message }, status: :internal_server_error
    end
  
    # Add or update the exchange_public_token method
    def exchange_public_token
      begin
        exchange_token_response = client.item_public_token_exchange(
          Plaid::ItemPublicTokenExchangeRequest.new(
            public_token: params[:public_token]
          )
        )
        
        access_token = exchange_token_response.access_token
        item_id = exchange_token_response.item_id

        # Save these values to your database for this user
        if current_user.update(plaid_access_token: access_token, plaid_item_id: item_id)
          render json: { success: true }, status: :ok
        else
          render json: { error: current_user.errors.full_messages }, status: :unprocessable_entity
        end
      rescue Plaid::ApiError => e
        Rails.logger.error "Plaid API Error: #{e.response_body}"
        render json: { error: 'Failed to exchange public token' }, status: :internal_server_error
      rescue StandardError => e
        Rails.logger.error "Unexpected error: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render json: { error: 'An unexpected error occurred' }, status: :internal_server_error
      end
    end
  
    def exchange_token(public_token)
      request = Plaid::ItemPublicTokenExchangeRequest.new({ public_token: public_token })
  
      response = client.item.public_token.exchange(public_token)
      access_token = response.access_token
      item_id = response.item_id
  
      Rails.logger.debug("Access token: #{access_token}")
      Rails.logger.debug("Item ID: #{item_id}")
  
      if current_user.update(plaid_access_token: access_token, plaid_item_id: item_id)
        Rails.logger.debug('Access token and item ID saved successfully.')
        Rails.logger.debug("Current user after save: #{current_user.inspect}")
      else
        Rails.logger.error("Failed to save access token and item ID. Errors: #{current_user.errors.full_messages.join(', ')}")
      end
    end
  
    def accounts
      access_token = current_user.plaid_access_token

      if access_token.blank?
        render json: { error: 'Access token is missing. Please link your account again.' }, status: :unprocessable_entity
        return
      end

      begin
        accounts_request = Plaid::AccountsGetRequest.new({ access_token: access_token })
        accounts_response = client.accounts_get(accounts_request)
        render json: { accounts: accounts_response.accounts }
      rescue Plaid::ApiError => e
        Rails.logger.error("Plaid API error: #{e.response_body}")
        render json: { error: 'Failed to fetch account data' }, status: :internal_server_error
      rescue StandardError => e
        Rails.logger.error("Unexpected error: #{e.message}")
        render json: { error: 'An unexpected error occurred' }, status: :internal_server_error
      end
    end

    def connection_status
      begin
        if current_user.plaid_access_token.present?
          render json: { 
            connected: true, 
            bank_name: current_user.bank_name || 'Connected Bank' 
          }
        else
          render json: { connected: false }
        end
      rescue StandardError => e
        Rails.logger.error("Error fetching connection status: #{e.message}")
        render json: { error: 'Failed to fetch connection status' }, status: :internal_server_error
      end
    end

    def transactions
      access_token = current_user.plaid_access_token

      if access_token.blank?
        render json: { error: 'Access token is missing. Please link your account again.' }, status: :unprocessable_entity
        return
      end

      begin
        start_date = (Date.today - 30).to_s
        end_date = Date.today.to_s
        
        transactions_request = Plaid::TransactionsGetRequest.new(
          access_token: access_token,
          start_date: start_date,
          end_date: end_date
        )
        
        transactions_response = client.transactions_get(transactions_request)
        render json: { transactions: transactions_response.transactions }
      rescue Plaid::ApiError => e
        Rails.logger.error("Plaid API error: #{e.response_body}")
        render json: { error: 'Failed to fetch transaction data' }, status: :internal_server_error
      rescue StandardError => e
        Rails.logger.error("Unexpected error: #{e.message}")
        render json: { error: 'An unexpected error occurred' }, status: :internal_server_error
      end
    end

    private

    def client
      @client ||= Rails.application.config.plaid_client
    end
  end
