require 'plaid'

plaid_env = (ENV['PLAID_ENV'] || 'sandbox').to_sym
puts "Setting Plaid environment to: #{plaid_env}"

configuration = Plaid::Configuration.new

puts "Available Plaid environments: #{Plaid::Configuration::Environment.to_hash}"
puts "Selected environment: #{plaid_env}"

configuration.server_index = Plaid::Configuration::Environment[plaid_env]
puts "Server index after setting: #{configuration.server_index}"

configuration.api_key['PLAID-CLIENT-ID'] = ENV['PLAID_CLIENT_ID']
configuration.api_key['PLAID-SECRET'] = ENV['PLAID_SECRET']

# Ensure sandbox environment
configuration.server_index = Plaid::Configuration::Environment[:sandbox]
configuration.host = "https://sandbox.plaid.com"

# Explicitly set the server_index again after setting the host
configuration.server_index = Plaid::Configuration::Environment[:sandbox]

puts "Final server index: #{configuration.server_index}"
puts "Final host: #{configuration.host}"

api_client = Plaid::ApiClient.new(configuration)
plaid_client = Plaid::PlaidApi.new(api_client)

Rails.application.config.plaid_client = plaid_client

# Log the full configuration
puts "Plaid configuration:"
puts "  Environment: #{configuration.server_index}"
puts "  Host: #{configuration.host}"
puts "  Client ID: #{configuration.api_key['PLAID-CLIENT-ID']}"
puts "  Secret (first 4 chars): #{configuration.api_key['PLAID-SECRET'][0..3]}"
