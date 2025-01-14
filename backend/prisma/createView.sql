DROP VIEW IF EXISTS transaction_with_tags;

CREATE VIEW transaction_with_tags AS
WITH
    system_tags AS (
        SELECT
            t.id as transaction_id,
            t.user_id,
            t.amount,
            t.description,
            t.date,
            st.id as system_tag_id,
            NULL as custom_tag_id,
            st.name as tag_name
        FROM
            "transaction" t
        LEFT JOIN system_tags_on_transaction stot
            ON t.id = stot.transaction_id
        LEFT JOIN system_tag st
            ON stot.tag_id = st.id
    ),
    custom_tags AS (
        SELECT
            t.id as transaction_id,
            t.user_id,
            t.amount,
            t.description,
            t.date,
            NULL as system_tag_id,
            ct.id as custom_tag_id,
            ct.name as tag_name
        FROM
            "transaction" t
        LEFT JOIN custom_tags_on_transaction ctot
            ON t.id = ctot.transaction_id
        LEFT JOIN custom_tag ct
            ON ctot.tag_id = ct.id
    )

SELECT * FROM system_tags
UNION
SELECT * FROM custom_tags
WHERE tag_name IS NOT NULL
UNION
SELECT
    id as transaction_id,
    user_id,
    amount,
    description,
    date,
    NULL as system_tag_id,
    NULL as custom_tag_id,
    NULL as tag_name
FROM "transaction" t
WHERE
    NOT EXISTS (
        SELECT 1 FROM system_tags_on_transaction stot WHERE stot.transaction_id = t.id
    ) AND NOT EXISTS (
        SELECT 1 FROM custom_tags_on_transaction ctot WHERE ctot.transaction_id = t.id
    )
ORDER BY transaction_id, system_tag_id NULLS LAST, custom_tag_id NULLS LAST;