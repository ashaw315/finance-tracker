class ReplaceDeviseWithJwtAuth < ActiveRecord::Migration[7.0]
  def change
    change_table :users do |t|
      t.string :password_digest
      
      # Remove Devise columns
      t.remove :encrypted_password
      t.remove :reset_password_token
      t.remove :reset_password_sent_at
      t.remove :remember_created_at
      # Add any other Devise columns you want to remove
    end
  end
end
