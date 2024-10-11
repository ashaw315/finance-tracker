class User < ApplicationRecord
  has_secure_password
  # encrypts :plaid_access_token

  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, length: { minimum: 6 }, on: :create
end
