-- This is an empty migration.

-- Create View
DROP VIEW IF EXISTS transaction_with_tag;

CREATE VIEW transaction_with_tag AS
    SELECT tr.id as transaction_id, ta.id as tag_id, tr.user_id, tr.amount, tr.description, tr.date, ta.name as tag_name
    FROM tags_on_transaction tt
    JOIN "transaction" tr ON tt.transaction_id = tr.id
    JOIN tag ta ON tt.tag_id = ta.id;