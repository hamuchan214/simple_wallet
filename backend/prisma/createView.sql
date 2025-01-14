DROP VIEW IF EXISTS transaction_with_tags;

CREATE VIEW transaction_with_tags AS
SELECT DISTINCT
    t.id as transaction_id,
    t.user_id,
    t.amount,
    t.description,
    t.date,
    st.id as system_tag_id,
    ct.id as custom_tag_id,
    COALESCE(st.name, ct.name) as tag_name
FROM
    "transaction" t
LEFT JOIN system_tags_on_transaction stot
    ON t.id = stot.transaction_id
LEFT JOIN system_tag st
    ON stot.tag_id = st.id
LEFT JOIN custom_tags_on_transaction ctot
    ON t.id = ctot.transaction_id
LEFT JOIN custom_tag ct
    ON ctot.tag_id = ct.id
WHERE
    st.id IS NOT NULL OR ct.id IS NOT NULL;
