const turf = require('@turf/turf');
const GeoJSON = require('geojson');
const Terraformer = require('@terraformer/wkt');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3001;

require('dotenv').config();
const SkyfiApiKey = process.env.SKYFI_API_KEY;


app.use(cors());
app.use(express.json());``

const headers = {
  "X-Skyfi-Api-Key": SkyfiApiKey
}

const skyfiPing = async() => {
  let ping_response = await axios.get(
      "https://app.skyfi.com/platform-api/ping",
      { headers: headers }
  );

  let ping = ping_response.data;
  console.log("ping:", ping.message);
  return ping;
}

const skyfiPlatformApiArchives = async(aoi) => {
    let request = {
        "aoi": `POLYGON ((72.68386197172187 23.264272143543554, 72.6838603264497 23.244080690741434, 72.66200949527511 23.244080690741434, 72.66200785000295 23.264272143543554, 72.68386197172187 23.264272143543554))`,
        "resolutions": ["VERY HIGH", "HIGH", "MEDIUM", "LOW"],
        "providers": ["PLANET"],
        "page_size": 20,
        "minOverlapRatio": 0.1,
        "open_data": true
    }
    let archives_response = await axios.post(
        "https://app.skyfi.com/platform-api/archives",
        request,
        { headers: headers }
    );

    let archives = archives_response.data;
    return archives;
}


const geoJsonToAoi = (geoJson) => {
  const aoi = turf.buffer(geoJson, 5, {units: 'kilometers'});
  console.log(aoi);
  console.log(turf.area(aoi)/1000000);
  const wkt = Terraformer.geojsonToWKT(aoi.geometry);
  console.log(wkt);
  return wkt;
}
  

app.get('/ping', async (req, res) => {
  try {
    let response = await skyfiPing();
    console.log(response);
    res.json({message: `${response.message}`});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
 }
});

app.post('/getJson', async (req, res) => {
  try {
     console.log(req.body); 
     res.json({ message: 'Data received successfully.' });
  } catch (error) {
     console.error("Error:", error);
     res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
 });
``

 app.post('/getCatelog', async (req, res) => {
  try {
    let geoJson = req.body;
    let aoi = geoJsonToAoi(geoJson);
    let response = await skyfiPlatformApiArchives(aoi);
    // console.log(response.archives);
    res.send(response);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }

 });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
