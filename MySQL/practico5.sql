2. El top 5 de actrices y actores de la tabla `actors` que tienen la mayor experiencia 
(i.e. el mayor número de películas filmadas) son también directores de las películas en
las que participaron. Basados en esta información, inserten, utilizando una subquery
los valores correspondientes en la tabla `directors`.

SELECT actor.first_name, actor.last_name, film_actor.film_id AS IdentificadorPelicula,
FROM actor
LEFT JOIN film_actor
ON actor.actor_id = film_actor.actor_id;

/* Obtengo el numeros de pelicuas en las que acturaron */
SELECT COUNT(film_actor.film_id) AS NumPeliculas
FROM film_actor
GROUP BY film_actor.actor_id;

/* Obtengo el nombre, apellido del actor con la catidad de peliculas que participo*/
SELECT actor.first_name, actor.last_name,
       COUNT(film_actor.film_id) AS NumPeliculas
FROM actor
LEFT JOIN film_actor ON actor.actor_id = film_actor.actor_id
GROUP BY actor.actor_id, actor.first_name, actor.last_name;

/*Obtengo el top 5 de actores con mayor numero de peliculas filmadas*/
SELECT actor.first_name, actor.last_name, COUNT(film_actor.film_id) AS NumPeliculas
FROM actor
LEFT JOIN film_actor ON actor.actor_id = film_actor.actor_id
GROUP BY actor.actor_id, actor.first_name, actor.last_name
ORDER BY NumPeliculas DESC
LIMIT 5;
--------------------------------------------------------------
/* Mas personalizado */
SELECT film_actor.actor_id, COUNT(*) AS num_films
FROM film_actor
GROUP BY film_actor.actor_id
ORDER BY num_films DESC
LIMIT 5;
---------------------------------------------------------------

/* Insertamos los datos a la tabla utilizando una subquery */
INSERT INTO descriptor (first_name, last_name, num_films)
SELECT actor.first_name, actor.last_name, topFive.num_films
FROM (
	SELECT film_actor.actor_id, COUNT(*) AS num_films
	FROM film_actor
	GROUP BY film_actor.actor_id
	ORDER BY num_films DESC
	LIMIT 5) AS topFive
INNER JOIN actor ON topFive.actor_id = actor.actor_id;
/* Basicamente aparece "estadistica1" pero si vamos a ver la tabla,
 * vemos que se completo dicha tabla con los top five de actores 
*/

/* -----------------------------------------------------------------------------*/

3. Agregue una columna `premium_customer` que tendrá un valor 'T' o 'F' de acuerdo a
si el cliente es "premium" o no. Por defecto ningún cliente será premium.
ALTER TABLE customer
ADD COLUMN premium_customer VARCHAR(2) DEFAULT 'F';
/*Acutalizar la BS y ver la tabla*/

/* -----------------------------------------------------------------------------*/

4. Modifique la tabla customer. Marque con 'T' en la columna `premium_customer` de
los 10 clientes con mayor dinero gastado en la plataforma.
/* Obtenemos los 10 clinetes que mas gastaron en plataforma */
SELECT payment.customer_id, SUM(payment.amount) AS gastosPlataforma /* gastoPlataforma solo esta agregado para ver el resultado*/
FROM payment
GROUP BY payment.customer_id
ORDER BY gastosPlataforma DESC
LIMIT 10;

SELECT customer.first_name, gastos.gastosPlataforma, customer.premium_customer 
FROM (
	SELECT payment.customer_id, SUM(payment.amount) AS gastosPlataforma
	FROM payment
	GROUP BY payment.customer_id
	ORDER BY gastosPlataforma DESC
	LIMIT 10
	) AS gastos
INNER JOIN customer ON gastos.customer_id = customer.customer_id;

/* Hacemos la modificacion en la tabla */
UPDATE customer c 
SET c.premium_customer = 'T'
WHERE c.customer_id IN (
	SELECT payment.customer_id, SUM(payment.amount) AS gastosPlataforma
	FROM payment
	GROUP BY payment.customer_id
	ORDER BY gastosPlataforma DESC
	LIMIT 10
);

/*FER*/
UPDATE customer
SET premium_customer = 'T'
WHERE customer_id IN (
	SELECT customer
	FROM(
		SELECT c.customer_id AS customer, SUM(p.amount) AS total
		FROM customer c
		JOIN payment p ON c.customer_id = p.customer_id
		GROUP BY customer
		ORDER BY total_amount DESC
		LIMIT 10
	) AS top10_customers
);

/* -----------------------------------------------------------------------------*/

5. Listar, ordenados por cantidad de películas (de mayor a menor), 
   los distintos ratings de las películas existentes 
   (Hint: rating se refiere en este caso a la clasificación según edad: G, PG, R, etc).

SELECT f.rating, COUNT(f.rating) AS rating
FROM film f
GROUP BY f.rating
ORDER BY rating DESC;

/* -----------------------------------------------------------------------------*/

6. ¿Cuáles fueron la primera y última fecha donde hubo pagos?
SELECT MIN(payment_date) AS primeraFechaPago
FROM payment;

SELECT MAX(payment_date) AS ultimaFechaPago
FROM payment;

/* Juntos en dos columnas */
SELECT MIN(payment_date) AS primeraFechaPago, MAX(payment_date) AS ultimaFechaPago
FROM payment;

/* En una sola columna la fecha de pago */ 
(SELECT MIN(payment_date) AS FechaPago
FROM payment)
UNION
(SELECT MAX(payment_date)
FROM payment);

/* -----------------------------------------------------------------------------*/

7. Calcule, por cada mes, el promedio de pagos (Hint: vea la manera de extraer el
nombre del mes de una fecha).

SELECT DATE_FORMAT(payment_date, '%m') AS mes,
       AVG(amount) AS promedio_pagos
FROM payment
GROUP BY mes
ORDER BY mes;

/* -----------------------------------------------------------------------------*/

8. Listar los 10 distritos que tuvieron mayor cantidad de alquileres 
   (con la cantidad total de alquileres).
SELECT a.district
FROM address a
LEFT JOIN customer c ON a.address_id = c.address_id;
/*---------*/
SELECT a.district 
FROM 
INNER JOIN address a 
-- FALTO TERMINAR


/* -----------------------------------------------------------------------------*/


9. Modifique la table `inventory_id` agregando una columna `stock` que sea un número
entero y representa la cantidad de copias de una misma película que tiene
determinada tienda. El número por defecto debería ser 5 copias.

ALTER TABLE inventory
ADD COLUMN stock INT DEFAULT 5;

/*---------------------------------------------------------------------------------*/


/* Funciones, Procedimientos y Tigger*/
10. Cree un trigger `update_stock` que, cada vez que se agregue un nuevo registro a la
tabla rental, haga un update en la tabla `inventory` restando una copia al stock de la
película rentada (Hint: revisar que el rental no tiene información directa sobre la
tienda, sino sobre el cliente, que está asociado a una tienda en particular).

DELIMITER //
CREATE TRIGGER update_stock 
AFTER INSERT ON rental
FOR EACH ROW
BEGIN
	DECLARE v_inventory_store_id INT;
    
    -- Obtener el store_id de la película alquilada a través de inventory
    SELECT i.store_id INTO v_inventory_store_id
    FROM inventory i
    WHERE i.inventory_id = NEW.inventory_id;
    
    -- Restar una copia del stock en la tabla inventory
    UPDATE inventory
    SET stock = stock - 1
    WHERE inventory_id = NEW.inventory_id;
    
    -- Luego, puedes realizar otras acciones o registros si es necesario
    -- como registro de la transacción, seguimiento de alquileres, etc.
END;

//

DELIMITER ;
/*---------------------------------------------------------------------------------*/

11. Cree una tabla `fines` que tenga dos campos: `rental_id` y `amount`. El primero es
una clave foránea a la tabla rental y el segundo es un valor numérico con dos decimales.
CREATE TABLE fines (
	rental_id INT,
	amount DECIMAL(10,2),
	FOREIGN KEY (rental_id) REFERENCES rental (rental_id)
);

/*---------------------------------------------------------------------------------*/

12. Cree un procedimiento `check_date_and_fine` que revise la tabla `rental` y cree un
registro en la tabla `fines` por cada `rental` cuya devolución (return_date) haya
tardado más de 3 días (comparación con rental_date). El valor de la multa será el
número de días de retraso multiplicado por 1.5.


CREATE PROCEDURE check_date_and_fine()
BEGIN
    DECLARE rental_id INT;
    DECLARE rental_date DATE;
    DECLARE return_date DATE;
    DECLARE days_late INT;
    DECLARE fine_amount DECIMAL(10, 2);
    
    -- Cursor para obtener los registros de alquiler con retraso
    DECLARE cur CURSOR FOR
        SELECT rental_id, rental_date, return_date
        FROM rental
        WHERE DATEDIFF(return_date, rental_date) > 3;
    
    -- Declarar manejo de errores para el cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND
        SET @done = 1;
    
    -- Variable para controlar el manejo de errores del cursor
    SET @done = 0;
    
    -- Abrir el cursor
    OPEN cur;
    
    -- Recorrer los registros del cursor
    read_loop: LOOP
        -- Leer los datos del cursor
        FETCH cur INTO rental_id, rental_date, return_date;
        
        -- Salir del ciclo si no hay más registros
        IF @done = 1 THEN
            LEAVE read_loop;
        END IF;
        
        -- Calcular los días de retraso
        SET days_late = DATEDIFF(return_date, rental_date) - 3;
        
        -- Calcular el monto de la multa
        SET fine_amount = days_late * 1.5;
        
        -- Insertar un registro en la tabla fines
        INSERT INTO fines (rental_id, amount)
        VALUES (rental_id, fine_amount);
    END LOOP;
    
    -- Cerrar el cursor
    CLOSE cur;
    
END;

CALL check_date_and_fine();

/*---------------------------------------------------------------------------------*/

13. Crear un rol `employee` que tenga acceso de inserción, eliminación y actualización a
la tabla `rental`.

CREATE ROLE employee;
GRANT INSERT, DELETE, UPDATE 
ON rental 
TO employee;
/* Ejecutar por separado*/

/*---------------------------------------------------------------------------------*/

14. Revocar el acceso de eliminación a `employee` y crear un rol `administrator` que
tenga todos los privilegios sobre la BD `sakila`.

REVOKE INSERT, DELETE, UPDATE
ON rental
FROM employee;

CREATE ROLE administrator
GRANT ALL PRIVILEGES
ON sakila.*
TO administrator;

/*---------------------------------------------------------------------------------*/

15. Crear dos roles de empleado. A uno asignarle los permisos de `employee` y al otro
de `administrator`.

CREATE ROLE empleado_employee;
GRANT GRANT INSERT, DELETE, UPDATE 
ON rental 
TO empleado_employee;

CREATE ROLE empleado_administrator
GRANT ALL PRIVILEGES
ON sakila.*
TO empleado_administrator;


USE olympics;
CREATE VIEW olimpiada AS
SELECT nr.region_name AS PAIS, s.sport_name AS DEPORTE, 
COUNT(IF m.medal_name) AS ORO, 
COUNT(m.medal_name) AS PLATA, 
COUNT(m.medal_name) AS BRONCE, 
COUNT(gc.id) AS PARTICIPACIONES
FROM noc_region nr
INNER JOIN person_region pr ON nr.id = pr.region_id
INNER JOIN person p ON pr.person_id = p.id
INNER JOIN games_competitor gc ON p.id = gc.person_id
INNER JOIN competitor_event ce ON gc.id = ce.competitor_id
INNER JOIN medal m ON ce.medal_id = m.id
INNER JOIN event e ON ce.event_id = e.id
INNER JOIN sport s ON e.sport_id = s.id
GROUP BY nr.region_name, s.sport_name;

