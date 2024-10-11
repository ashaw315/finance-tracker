class ApplicationController < ActionController::Base
    include ActionController::Cookies
    skip_before_action :verify_authenticity_token
    before_action :set_csrf_cookie
    before_action :authorized

    def encode_token(payload)
        JWT.encode(payload, Rails.application.secrets.secret_key_base)
    end

    def current_user
        auth_token = cookies.signed[:auth_token]
        if auth_token
            begin
                decoded_token = JWT.decode(auth_token, Rails.application.secrets.secret_key_base, true, { algorithm: 'HS256' })
                user_id = decoded_token[0]['user_id']
                @current_user ||= User.find_by(id: user_id)
            rescue JWT::DecodeError
                nil
            end
        end
    end

    def authorized
        render json: { message: 'Please log in' }, status: :unauthorized unless current_user
    end

    def csrf_token
        render json: { csrf_token: form_authenticity_token }
    end

    private

    def set_csrf_cookie
        cookies["CSRF-TOKEN"] = form_authenticity_token
    end

    def self.skip_authorization(*actions)
        skip_before_action :authorized, only: actions
    end

    skip_authorization :csrf_token
end
