#Model-Store-Web
Web client developed with React.JS to view, upload and download 3D Models from a Rest API.

Rest API Repository [Model-Store](https://github.com/pavan71198/Model-Store)

## Features of the web client
- Login, Register, Models List, Upload Model and Download Model pages
- Renaming and Deleting models
- Axios for Rest API requests
- JWT Token stored in Local Storage used for authorizing API requests.
- Three.JS for rendering the 3D Models
- Scroll to zoom and drag to rotate in 3D Model Viewer

## Notes for running the Client on localhost:
- Change the `proxy` parameter in `package.json` to the API server URL to avoid CORS errors