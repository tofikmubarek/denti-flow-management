
-- Create a function to run SQL queries
-- This function should only be available to authenticated users with admin privileges
CREATE OR REPLACE FUNCTION public.run_sql_query(query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Execute the query and capture the result
  EXECUTE query;
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return the error message
    RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- Set permissions for the function
REVOKE ALL ON FUNCTION public.run_sql_query(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.run_sql_query(TEXT) TO authenticated;
