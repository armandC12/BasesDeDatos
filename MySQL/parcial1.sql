-- 1. Crear un campo nuevo `total_medals` en la tabla `person` que almacena la
--    cantidad de medallas ganadas por cada persona. Por defecto, con valor 0.

ALTER TABLE person
ADD COLUMN total_medals INT DEFAULT 0;

/*--------------------------------------------------------------------------*/

-- 2. Actualizar la columna  `total_medals` de cada persona con el recuento real de
--    medallas que ganó. Por ejemplo, para Michael Fred Phelps II, luego de la
--    actualización debería tener como valor de `total_medals` igual a 28.

-- hacemos el recuento de medallas por competidor para luego actualizar la columna total_medals
SELECT gc.person_id AS persona, gc.id AS competidor, med.medallas
FROM (
    SELECT ce.competitor_id, COUNT(m.medal_name) AS medallas
    FROM competitor_event ce
    LEFT JOIN medal m ON ce.medal_id = m.id
    GROUP BY ce.competitor_id
    ) AS med
INNER JOIN games_competitor gc ON med.competitor_id = gc.id;

-- Juntamos a las personas con medallas
SELECT p.full_name, SUM(meda.medallas) AS totalMedallas
FROM (
    SELECT gc.person_id AS persona, gc.id AS competidor, med.medallas
    FROM (
        SELECT ce.competitor_id, COUNT(m.medal_name) AS medallas
        FROM competitor_event ce
        LEFT JOIN medal m ON ce.medal_id = m.id
        GROUP BY ce.competitor_id
        ) AS med
    INNER JOIN games_competitor gc ON med.competitor_id = gc.id
    ) AS meda
INNER JOIN person p ON p.id = meda.persona
GROUP BY p.full_name;

-- Para actualizar la columna de medallas
UPDATE person
SET p.total_medals = s.totalMedallas
FROM (
    SELECT p.full_name, SUM(meda.medallas) AS totalMedallas
    FROM (
        SELECT gc.person_id AS persona, gc.id AS competidor, med.medallas
        FROM (
            SELECT ce.competitor_id, COUNT(m.medal_name) AS medallas
            FROM competitor_event ce
            LEFT JOIN medal m ON ce.medal_id = m.id
            GROUP BY ce.competitor_id
            ) AS med
        INNER JOIN games_competitor gc ON med.competitor_id = gc.id
        ) AS meda
    INNER JOIN person p ON p.id = meda.persona
    GROUP BY p.full_name
    ) AS s
WHERE person.full_name = s.full_name;


--3. Devolver todos los medallistas olímpicos de Argentina, es decir, los que hayan
--   logrado alguna medalla de oro, plata, o bronce, enumerando la cantidad por tipo de
--   medalla. Por ejemplo, la query debería retornar casos como el siguiente:
--   (Juan Martín del Potro, Bronze, 1), (Juan Martín del Potro, Silver,1)

USE olympics;
-- Muestro el nombre del competidor, nombre de medalla y cantidad de medallas
SELECT p.full_name, m.medal_name, COUNT(m.medal_name) AS Cantidad
-- elijo la tabla person
FROM person p
-- hago un inner join con la tabla games_competitor para obtener el id del competidor
INNER JOIN games_competitor gc ON p.id = gc.person_id
-- hago un inner join con la tabla competitor_event para obtener el id de la medalla
INNER JOIN competitor_event ce ON gc.id = ce.competitor_id
-- hago un inner join con la tabla medal para obtener el nombre de la medalla
INNER JOIN medal m ON ce.medal_id = m.id
-- hago un inner join con la tabla peson_region para obtener el id de la region
INNER JOIN person_region pr ON p.id = pr.person_id
-- hago un inner join con la tabla noc_region para obtener el nombre del pais
INNER JOIN noc_region nr ON pr.region_id = nr.id
-- filtro por el pais Argentina y por las medallas de oro, plata y bronce
WHERE nr.noc = 'ARG' AND m.medal_name IN ('Gold', 'Silver', 'Bronze')
-- agrupo por nombre y nombre de medalla
GROUP BY p.full_name, m.medal_name
-- ordeno por cantidad de medallas
ORDER BY Cantidad DESC;

/*--------------------------------------------------------------------------*/

-- 4. Listar el total de medallas ganadas por los deportistas argentinos 
--    en cada deporte.

USE olympics;
SELECT p.full_name, COUNT(m.medal_name) AS Cantidad, s.sport_name AS Deporte
FROM person p
INNER JOIN games_competitor gc ON p.id = gc.person_id
INNER JOIN competitor_event ce ON gc.id = ce.competitor_id
INNER JOIN medal m ON ce.medal_id = m.id
INNER JOIN event e ON ce.event_id = e.id
INNER JOIN sport s ON e.sport_id = s.id
INNER JOIN person_region pr ON p.id = pr.person_id
INNER JOIN noc_region nr ON pr.region_id = nr.id
WHERE nr.noc = 'ARG' AND m.medal_name IN ('Gold', 'Silver', 'Bronze')
GROUP BY p.full_name, s.sport_name
ORDER BY Cantidad DESC;

/*--------------------------------------------------------------------------*/
-- 5. Listar el número total de medallas de oro, plata y bronce ganadas por cada país
-- (país representado en la tabla `noc_region`), agruparlas los resultados por pais.

USE olympics;
SELECT nr.region_name AS PAIS, COUNT(m.medal_name) AS Cantidad
FROM noc_region nr
INNER JOIN person_region pr ON nr.id = pr.region_id
INNER JOIN person p ON pr.person_id = p.id
INNER JOIN games_competitor gc ON p.id = gc.person_id
INNER JOIN competitor_event ce ON gc.id = ce.competitor_id
INNER JOIN medal m ON ce.medal_id = m.id
WHERE m.medal_name IN ('Gold', 'Silver', 'Bronze')
GROUP BY nr.region_name
ORDER BY Cantidad DESC;

-- Como podria haer para que muestre la cantidad de medallas por pais y por tipo de medalla
USE olympics;
SELECT nr.region_name AS PAIS, m.medal_name AS Medalla, COUNT(m.medal_name) AS Cantidad
FROM noc_region nr
INNER JOIN person_region pr ON nr.id = pr.region_id
INNER JOIN person p ON pr.person_id = p.id
INNER JOIN games_competitor gc ON p.id = gc.person_id
INNER JOIN competitor_event ce ON gc.id = ce.competitor_id
INNER JOIN medal m ON ce.medal_id = m.id
WHERE m.medal_name IN ('Gold', 'Silver', 'Bronze')
GROUP BY nr.region_name, m.medal_name
ORDER BY Cantidad DESC;

/*--------------------------------------------------------------------------*/

-- 6. Listar el país con más y menos medallas ganadas en la historia de las olimpiadas.

-- Por la consulta anterior, podemos ver que el pais con mas medallas es USA y el pais con menos medallas es Eritrea
-- entonces, para mostrar el pais con mas medallas, hacemos un union con el pais con menos medallas
-- y ordenamos por cantidad de medallas
-- y mostramos el primer resultado
USE olympics;
(SELECT meda.PAIS, MAX(meda.Cantidad) AS Cantidad
FROM (
    SELECT nr.region_name AS PAIS, COUNT(m.medal_name) AS Cantidad
    FROM noc_region nr
    INNER JOIN person_region pr ON nr.id = pr.region_id
    INNER JOIN person p ON pr.person_id = p.id
    INNER JOIN games_competitor gc ON p.id = gc.person_id
    INNER JOIN competitor_event ce ON gc.id = ce.competitor_id
    INNER JOIN medal m ON ce.medal_id = m.id
    WHERE m.medal_name IN ('Gold', 'Silver', 'Bronze')
    GROUP BY nr.region_name
    ORDER BY Cantidad DESC 
    ) AS meda
INNER JOIN noc_region nr ON meda.PAIS = nr.region_name
GROUP BY meda.PAIS
ORDER BY Cantidad DESC -- para que muestre el pais con mas medallas primero
LIMIT 1
)
UNION
(
SELECT meda.PAIS, MIN(meda.Cantidad) AS Cantidad
FROM (
    SELECT nr.region_name AS PAIS, COUNT(m.medal_name) AS Cantidad
    FROM noc_region nr
    INNER JOIN person_region pr ON nr.id = pr.region_id
    INNER JOIN person p ON pr.person_id = p.id
    INNER JOIN games_competitor gc ON p.id = gc.person_id
    INNER JOIN competitor_event ce ON gc.id = ce.competitor_id
    INNER JOIN medal m ON ce.medal_id = m.id
    WHERE m.medal_name IN ('Gold', 'Silver', 'Bronze')
    GROUP BY nr.region_name
    ORDER BY Cantidad DESC 
    ) AS meda
INNER JOIN noc_region nr ON meda.PAIS = nr.region_name
GROUP BY meda.PAIS
ORDER BY Cantidad ASC -- para que muestre el pais con menos medallas primero
LIMIT 1
)

/*--------------------------------------------------------------------------*/
-- 7. Crear dos triggers:
--    a. Un trigger llamado `increase_number_of_medals` que incrementará en 1 el
--    valor del campo `total_medals` de la tabla `person`.
--    b. Un trigger llamado `decrease_number_of_medals` que decrementará en 1
--    el valor del campo `totals_medals` de la tabla `person`.
--    El primer trigger se ejecutará luego de un `INSERT` en la tabla `competitor_event` y
--    deberá actualizar el valor en la tabla `person` de acuerdo al valor introducido (i.e.
--    sólo aumentará en 1 el valor de `total_medals` para la persona que ganó una
--    medalla). Análogamente, el segundo trigger se ejecutará luego de un `DELETE` en la
--    tabla `competitor_event` y sólo actualizará el valor en la persona correspondiente.

-- Primer trigger
USE olympics;
CREATE TRIGGER increase_number_of_medals AFTER INSERT
ON competitor_event FOR EACH ROW
BEGIN 
    UPDATE person
    SET total_medals = total_medals + 1
    WHERE id = NEW.competitor_id
END;

-- Segundo trigger
USE olympics;
CREATE TRIGGER decrease_number_of_medals DELETE AFTER
ON competitor_event FOR EACH ROW
BEGIN
    UPDATE person
    SET total_medals = total_medals - 1
    WHERE id = OLD.competitor_id
END;

/*--------------------------------------------------------------------------*/

USE olympics;
SELECT * FROM competitor_event;

--8. Crear un procedimiento `add_new_medalists` que tomará un `event_id`, y tres ids
--   de atletas `g_id`, `s_id`, y `b_id` donde se deberá insertar tres registros en la tabla
--   `competitor_event` asignando a `g_id` la medalla de oro, a `s_id` la medalla de
--   plata, y a `b_id` la medalla de bronce.

CREATE PROCEDURE add_new_medalists(in event_id int, in g_id int, in s_id int, in b_id int)
BEGIN
    INSERT INTO competitor_event event_id
    VALUES (g_id, event_id, 1), (s_id, event_id, 2), (b_id, event_id, 3);
END;

/*--------------------------------------------------------------------------*/
USE olympics;
SELECT * FROM games;
-- 9. Crear el rol `organizer` y asignarle permisos de eliminación sobre la tabla `games`
-- y permiso de actualización sobre la columna `games_name` de la tabla `games`.

-- Creamos el rol
USE olympics;
CREATE ROLE organizer;
GRANT DELETE ON games TO organizer;
GRANT UPDATE (games_name) ON games TO organizer;
