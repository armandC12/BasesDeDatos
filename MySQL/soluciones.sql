--1. Listar todas las ciudades sede de los juegos olímpicos de verano junto con su año, de más reciente a menos reciente (1p)

USE olympics;
SELECT c.city_name AS CIUDAD, g.games_year AS AÑO, g.season AS Temporada
FROM city c
INNER JOIN games_city gc ON c.id = gc.city_id
INNER JOIN games g ON gc.games_id = g.id
WHERE g.season = "Summer"
GROUP BY c.city_name, g.games_year, g.season
ORDER BY g.games_year DESC;

--2. Obtener el ranking de los 10 países con más medallas de oro en fútbol (1.5p)

USE olympics;
SELECT nr.region_name AS PAIS, COUNT(m.medal_name) AS CANTIDAD
FROM noc_region nr
INNER JOIN person_region pr ON nr.id = pr.region_id
INNER JOIN person p ON pr.person_id = p.id
INNER JOIN games_competitor gc ON p.id = gc.person_id
INNER JOIN competitor_event ce ON gc.id = ce.competitor_id
INNER JOIN medal m ON ce.medal_id = m.id
INNER JOIN event e ON ce.event_id = e.id
INNER JOIN sport s ON e.sport_id = s.id
WHERE m.medal_name = 'Gold' AND s.sport_name = 'Football'
GROUP BY nr.region_name
ORDER BY CANTIDAD DESC
LIMIT 10;

--3. Listar con la misma query el país con más participaciones y 
--   el país con menos participaciones en los juegos olímpicos (2p)

-- Listamo el pais con mas participaciones usando la query del punto 2
USE olympics;
(SELECT nr.region_name AS PAIS, COUNT(gc.id) AS CANTIDAD
FROM noc_region nr
INNER JOIN person_region pr ON nr.id = pr.region_id
INNER JOIN person p ON pr.person_id = p.id
INNER JOIN games_competitor gc ON p.id = gc.person_id
GROUP BY nr.region_name
ORDER BY CANTIDAD DESC
LIMIT 1
)
UNION
-- Listamos el pais con menos participaciones usando la query del punto 2
(
SELECT nr.region_name AS PAIS, COUNT(gc.id) AS CANTIDAD
FROM noc_region nr
INNER JOIN person_region pr ON nr.id = pr.region_id
INNER JOIN person p ON pr.person_id = p.id
INNER JOIN games_competitor gc ON p.id = gc.person_id
GROUP BY nr.region_name
ORDER BY CANTIDAD ASC
LIMIT 1
)

--4. Crear una vista en la que se muestren entradas del tipo (país, deporte, 
--   medallas de oro, medallas de plata, medallas de bronce, participaciones 
--   sin medallas) para cada país y deporte 

USE olympics;
CREATE VIEW medallas AS
SELECT nr.region_name AS PAIS, s.sport_name AS DEPORTE, 
COUNT(IF(m.medal_name = 'Gold', 1, NULL)) AS ORO,
COUNT(IF(m.medal_name = 'Silver', 1, NULL)) AS PLATA,
COUNT(IF(m.medal_name = 'Bronze', 1, NULL)) AS BRONCE,
COUNT(IF(m.medal_name IS NULL, 1, NULL)) AS PARTICIPACIONES_SIN_MEDALLAS
FROM noc_region nr
INNER JOIN person_region pr ON nr.id = pr.region_id
INNER JOIN person p ON pr.person_id = p.id
INNER JOIN games_competitor gc ON p.id = gc.person_id
INNER JOIN competitor_event ce ON gc.id = ce.competitor_id
INNER JOIN medal m ON ce.medal_id = m.id
INNER JOIN event e ON ce.event_id = e.id
INNER JOIN sport s ON e.sport_id = s.id
GROUP BY nr.region_name, s.sport_name;

-- probamos la vista
USE olympics;
SELECT * FROM medallas;

-- 5. Crear un procedimiento que reciba como parámetro el nombre de un país y 
--    devuelva la cantidad total (sumando todos los deportes) de medallas de oro, 
--    plata y bronce ganadas por ese país. Puede usar la vista creada en el punto anterior, 
--    va a ser mucho más fácil.

USE olympics;
CREATE PROCEDURE medallasPaiss(IN pais VARCHAR(70), OUT oro INT, OUT plata INT, OUT bronce INT)
BEGIN
    SELECT SUM(ORO) INTO oro FROM medallas WHERE PAIS = pais;
    SELECT SUM(PLATA) INTO plata FROM medallas WHERE PAIS = pais;
    SELECT SUM(BRONCE) INTO bronce FROM medallas WHERE PAIS = pais;
END

-- probamos el procedimiento
USE olympics;
CALL medallasPaiss('Argentina', @oro, @plata, @bronce);
SELECT @oro, @plata, @bronce;


-- 6. OJO, este ejercicio, dejenlo para el final, porque cambia el schema y 
-- les puede invalidar los ejercicios anteriores. La tabla sport solo se usa 
-- para contener el nombre del deporte. Vamos a simplificar el modelo y eliminarla.
-- Para ello, debemos:
-- Actualizar la tabla `event` para que tenga una columna `sport_name` con el nombre del deporte. 
-- Además introducir el nombre de deporte correspondiente (1p)
-- Eliminar la columna `sport_id` de la tabla `event` (0.25p)
-- Eliminar la tabla `sport` (0.25p)

USE olympics;
SELECT * FROM sport;

-- Actualizamos la tabla event con la columna sport_name
USE olympics;
ALTER TABLE event
ADD COLUMN sport_name VARCHAR(200);

-- introducimos el nombre del deporte correspondiente copiando el nombre de la tabla sport
USE olympics;
UPDATE event
SET sport_name = (
    SELECT sport_name
    FROM sport
    WHERE sport.id = event.sport_id
);

-- Eliminamos la columna sport_id de la tabla event
USE olympics;
ALTER TABLE event
DROP COLUMN sport_id;

-- Eliminamos la tabla sport
USE olympics;
DROP TABLE sport;


