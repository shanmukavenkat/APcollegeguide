/*
  # Add function to check if email exists

  1. New Functions
    - `check_email_exists`: Function to check if an email is already registered
  2. Security
    - Function is accessible to authenticated and anonymous users
*/

CREATE OR REPLACE FUNCTION check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = email_to_check
  );
END;
$$;