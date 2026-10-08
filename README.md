# Port Harcourt 3D City

Interactive 3D model of Port Harcourt, Rivers State, Nigeria. Built with Three.js using ES modules.

## How to Run

Requires a local web server (ES modules cannot load from file://).

```bash
# With Node.js
npx serve .

# With Python
python3 -m http.server 8080

# With VS Code
Use the Live Server extension
```

Then open http://localhost:8080 (or whatever port your server uses).

## Controls

- Left drag: Orbit camera
- Right drag / two-finger drag: Pan
- Scroll: Zoom in/out
- Click landmark: View info panel
- Hover landmark: Show name tooltip
- Search bar (top left): Type any landmark name
- Map button: Toggle minimap
- Day/Night button: Toggle lighting
- Overview button: Reset to bird's eye view

## Project Structure

```
/src
  /core          - Three.js engine setup (scene, renderer, camera, controls, lighting)
  /terrain       - Ground, rivers, roads, vegetation
  /landmarks     - All 20 landmark models (one file per landmark)
  /buildingSystems - Reusable room compartments (offices, toilets, kitchens, corridors...)
  /furniture     - Desks, chairs, beds, sofas, bathroom sets, kitchen sets
  /vehicles      - Car models (Camry, G-Wagon, Cybertruck, Hilux, Corolla, Taxi, Bus, Truck)
  /map           - 2D minimap canvas renderer
  /ui            - HUD, info panel, interaction / raycasting
  /utils         - Constants, helpers, camera tween, night utilities
  /data          - Landmark data, road network, vehicle routes, parking lots
```

## Landmarks (20)

1. Port Harcourt City Hall
2. Pleasure Park
3. Port Harcourt International Airport (Omagwa)
4. Rivers State Government House
5. Port Harcourt Tourist Beach
6. Isaac Boro Park
7. Port Harcourt Mall
8. Rivers State University
9. Waterfront Bridge and Dock
10. Cultural Centre
11. Civic Centre
12. Blue Peter Hotel
13. Presidential Hotel
14. Liberation Stadium
15. Mile One Market
16. Rumuokoro Roundabout
17. Port Harcourt Refinery
18. Onne Port
19. Airport Terminal Two
20. New GRA Residential Area

## How to Extend

### Add a landmark
1. Create `/src/landmarks/myLandmark.js` exporting `buildMyLandmark(landmark)`
2. Add entry to `/src/data/landmarksData.js`
3. Import and register in `/src/landmarks/index.js`

### Add a vehicle type
1. Add builder function in `/src/vehicles/carModels.js`
2. Register in `BUILDERS` in `/src/vehicles/carFactory.js`
3. Reference in vehicle routes in `/src/data/vehicleRoutesData.js`

### Add a road
1. Add entry to `ROADS` array in `/src/data/roadsData.js`
2. Add a vehicle route using that road in `vehicleRoutesData.js`

## Performance Notes

- Vegetation uses THREE.InstancedMesh for trees (major perf win)
- Cars share wheel geometry via module-level constants
- Minimap renders every 4 frames, not every frame
- Day/night toggle uses emissive intensity, not scene rebuild
- Target: 60fps at medium city zoom on a modern GPU
