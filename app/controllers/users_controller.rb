class UsersController < ApplicationController
    skip_before_action :authorized, only: [:create, :index]
    rescue_from ActiveRecord::RecordInvalid, with: :handle_invalid_record
    
    def index
        users = User.all
        render json: users, each_serializer: UserSerializer, status: :ok
    end

    def create
        begin
          user = User.new(user_params)
          if user.save
            @token = encode_token({ user_id: user.id })
            render json: { user: UserSerializer.new(user), token: @token }, status: :created
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        rescue ActionController::ParameterMissing => e
          render json: { error: e.message }, status: :bad_request
        end
    end

    def me
        render json: { user: UserSerializer.new(current_user) }, status: :ok
    end

    private
    def user_params 
        params.permit(:username, :email, :password,)
    end
      
    def handle_invalid_record(invalid)
        render json: { errors: invalid.record.errors.full_messages }, status: :unprocessable_entity
    end
end
