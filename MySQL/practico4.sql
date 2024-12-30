-- 1. Listar el nombre de la ciudad y el nombre del país de todas las ciudades que pertenezcan a países con una población menor a 10000 habitantes.
SELECT city.Name AS Ciudad, country.Name AS Pais, country.Population AS Habitantes
FROM city
INNER JOIN country ON city.CountryCode = country.Code
WHERE city.CountryCode IN (
	SELECT country.Code
	FROM country
	WHERE country.Population < 10000
)
ORDER BY Habitantes DESC;

-- 2. Listar todas aquellas ciudades cuya población sea mayor que la población promedio entre todas las ciudades.
SELECT city.Name AS Ciudad, city.Population AS Habitantes
FROM city
WHERE city.Population > (
	SELECT AVG(city.Population)
	FROM city)
ORDER BY Habitantes DESC;

-- AVG_Promed = 350468.2236
SELECT AVG(city.Population) AS Habitantes
FROM city;
-- ==============================================

-- 3. Listar todas aquellas ciudades no asiáticas cuya población sea igual o mayor a la población total de algún país de Asia.
SELECT city.Name AS Ciudades_No_Asiaticas, country.Continent, city.Population AS Poblacion 
FROM city
INNER JOIN country ON city.CountryCode = country.Code
WHERE country.Continent != 'Asia' AND city.Population > (
	SELECT country.Population
	FROM country
	WHERE country.Name = 'Bhutan'
	)
ORDER BY city.Population DESC;

-- Hacemos la seleccion de las ciudades que no pertenecen a Asia
SELECT city.Name AS Ciudades_No_Asiaticas, country.Continent 
FROM city
INNER JOIN country ON city.CountryCode = country.Code
WHERE country.Continent != 'Asia';

-- Seleccion de la poblacion de un pais asiatico, por ejemplo China
SELECT country.Name, country.Population
FROM country
WHERE country.Continent = 'Asia' AND country.Name = 'China'
ORDER BY country.Population DESC;
-- ==========================================================================

-- 4. Listar aquellos países junto a sus idiomas no oficiales, que superen en porcentaje de hablantes a cada uno de los idiomas oficiales del país.
SELECT country.Name, countrylanguage.`Language`, countrylanguage.IsOfficial, countrylanguage.Percentage
FROM country
LEFT JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
WHERE countrylanguage.IsOfficial = "F" AND countrylanguage.Percentage > (
	SELECT MAX(countrylanguage.Percentage)
	FROM countrylanguage
	WHERE country.Code = countrylanguage.CountryCode AND countrylanguage.IsOfficial = "T");

-- Los paises de idioma no oficial tienen que SUPERAR en porcentaje hablante a cada uno de los idiomas oficial
SELECT country.Name, countrylanguage.`Language`, countrylanguage.IsOfficial, countrylanguage.Percentage
FROM country
LEFT JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
WHERE countrylanguage.IsOfficial = "T";
-- =============================================================================

-- 5. Listar (sin duplicados) aquellas regiones que tengan países con una superficie menor a 1000 km2 y exista (en el país) al menos una ciudad con más de 100000 habitantes.
--  (Hint: Esto puede resolverse con o sin una subquery, intenten encontrar ambas respuestas).

SELECT country.Region AS Regiones, country.SurfaceArea AS SUPERFICIE, city.Population AS HABITANTES_CIUDAD, country.Name AS PAIS
FROM country
LEFT JOIN city ON city.CountryCode = country.Code
WHERE country.SurfaceArea < 1000 
AND EXISTS (
		SELECT city.Population
		FROM city
		WHERE city.CountryCode = country.Code AND city.Population > 100000
	    );
	   
-- ---------------------------------------------
(
SELECT country.Region AS Region, country.Name AS Pais, country.SurfaceArea AS Superficie, city.Population AS Habitantes_Ciudad
FROM country
LEFT JOIN city ON country.Code = city.CountryCode
WHERE country.SurfaceArea < 1000;
)
-- ===================================================================================

-- 6. Listar el nombre de cada país con la cantidad de habitantes de su ciudad más poblada. 
--  (Hint: Hay dos maneras de llegar al mismo resultado. Usando consultas escalares o usando agrupaciones, encontrar ambas).

SELECT country.Name AS PAIS, MAX(city.Population) AS HABITANTES_CIUDAD
FROM country
LEFT JOIN city ON country.Code = city.CountryCode
GROUP BY country.Name;
-- =====================================================================================

-- 7. Listar aquellos países y sus lenguajes no oficiales cuyo porcentaje de hablantes sea mayor al promedio de hablantes de los lenguajes oficiales.
SELECT country.Name AS PAIS, countrylanguage.`Language` AS LENGUAJE_NO_OFFICIAL
FROM country
LEFT JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
WHERE countrylanguage.IsOfficial = "F" 
	AND countrylanguage.Percentage > (
	SELECT AVG(countrylanguage.Percentage)
	FROM countrylanguage
	WHERE country.Code = countrylanguage.CountryCode AND countrylanguage.IsOfficial = "T"
	);
-- ====================================================================================

-- 8. Listar la cantidad de habitantes por continente ordenado en forma descendente.
SELECT 


-- 9. Listar el promedio de esperanza de vida (LifeExpectancy) por continente con una esperanza de vida entre 40 y 70 años.

-- 10. Listar la cantidad máxima, mínima, promedio y suma de habitantes por continente.
SELECT
    continente,
    MAX(habitantes) AS max_habitantes,
    MIN(habitantes) AS min_habitantes,
    AVG(habitantes) AS promedio_habitantes,
    SUM(habitantes) AS suma_habitantes
FROM
    paises
GROUP BY
    continente;

