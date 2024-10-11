class AuthController < ApplicationController
    skip_authorization :login, :register, :check_auth_status
    skip_before_action :authorized, only: [:login, :register, :csrf_token, :check_auth_status]
    rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found

    def register
        ActiveRecord::Base.transaction do
            user = User.new(user_params)
            if user.save
                token = encode_token({ user_id: user.id })
                cookies.signed[:auth_token] = {
                    value: token,
                    httponly: true,
                    secure: Rails.env.production?,
                    expires: 1.day.from_now
                }
                render json: { user: UserSerializer.new(user) }, status: :created
            else
                Rails.logger.error("User validation failed: #{user.errors.full_messages}")
                render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
            end
        end
    rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    rescue StandardError => e
        Rails.logger.error("An unexpected error occurred: #{e.message}")
        render json: { error: 'An unexpected error occurred' }, status: :internal_server_error
    end

    def login 
        @user = User.find_by!(username: login_params[:username])
        if @user.authenticate(login_params[:password])
            token = encode_token(user_id: @user.id)
            cookies.signed[:auth_token] = {
                value: token,
                httponly: true,
                secure: Rails.env.production?,
                expires: 1.day.from_now
            }
            render json: { user: UserSerializer.new(@user) }, status: :accepted
        else
            render json: { message: 'Incorrect password' }, status: :unauthorized
        end
    end

    def check_auth_status
        if current_user
            render json: { user: UserSerializer.new(current_user), isAuthenticated: true }, status: :ok
        else
            render json: { isAuthenticated: false }, status: :unauthorized
        end
    end

    def logout
        cookies.delete(:auth_token)
        render json: { message: 'Logged out successfully' }, status: :ok
    end

    private 

    def user_params
        params.key?(:auth) ? params.require(:auth).permit(:username, :email, :password) : params.permit(:username, :email, :password)
    end

    def login_params 
        params.permit(:username, :password)
    end

    def handle_record_not_found(e)
        render json: { message: "User doesn't exist" }, status: :unauthorized
    end
end