class Api::Auth::SessionsController < ApplicationController
    def create
        user = User.find_by(email: session_params[:email])

        if user && user.valid_password?(session_params[:password])
            token = encode_token(user.id)
            render json: { message: 'Logged in successfully', user: user, token: token }, status: :ok
        else
            render json: { errors: ['Invalid email or password'] }, status: :unauthorized
        end
    end

    private

    def session_params
        params.require(:user).permit(:email, :password)
    end
end