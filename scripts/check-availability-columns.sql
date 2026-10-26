SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'doctor_availability'
ORDER BY ordinal_position;
