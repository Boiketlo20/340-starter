-- 1. Inserting a new record to the account table
INSERT INTO public.account(account_firstname, 
	account_lastname,
	account_email,
	account_password)
	VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Modifying a record in the account table
UPDATE public.account SET account_type = 'Admin' 
	WHERE account_id = 1;

-- 3. Deleting a record
DELETE FROM public.account WHERE account_id = 1;

--4. Modifying substring text with a new one
UPDATE public.inventory SET inv_description
	= REPLACE(inv_description, 'small interiors', 'a huge interior') 
	WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Using INNER JOIN to find items
SELECT inv_make, inv_model, classification_name 
FROM public.inventory
INNER JOIN public.classification 
ON public.inventory.classification_id = 
public.classification.classification_id 
WHERE public.classification.classification_id = 2;

-- 6. Modifying substring text
UPDATE public.inventory SET inv_image
	= REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail
	= REPLACE(inv_thumbnail, '/images', '/images/vehicles');