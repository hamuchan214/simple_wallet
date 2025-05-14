CREATE VIEW IF NOT EXISTS budget_usage AS
SELECT 
    b.id as budget_id,
    b.user_id,
    bc.category_id,
    ct.name as category_name,
    bc.amount as budget_amount,
    COALESCE(SUM(CASE 
        WHEN t.date BETWEEN b.start_date AND b.end_date 
        THEN t.amount 
        ELSE 0 
    END), 0) as used_amount,
    bc.amount - COALESCE(SUM(CASE 
        WHEN t.date BETWEEN b.start_date AND b.end_date 
        THEN t.amount 
        ELSE 0 
    END), 0) as remaining,
    b.start_date,
    b.end_date
FROM budget b
JOIN budget_category bc ON b.id = bc.budget_id
JOIN custom_tag ct ON bc.category_id = ct.id
LEFT JOIN custom_tags_on_transaction ctt ON ct.id = ctt.tag_id
LEFT JOIN "transaction" t ON ctt.transaction_id = t.id
GROUP BY b.id, b.user_id, bc.category_id, ct.name, bc.amount, b.start_date, b.end_date; 