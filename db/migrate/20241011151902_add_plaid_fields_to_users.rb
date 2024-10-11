class AddPlaidFieldsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :plaid_access_token, :string
    add_column :users, :plaid_item_id, :string
    add_column :users, :bank_name, :string
  end
end
