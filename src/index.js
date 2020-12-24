const app = require('./app')();
const port = process.env.port;

const initializeDbAndStartServer = async () => {
    app.listen(port, function () {
        // models.sequelize.sync();
    });
    console.log(`server listening on port  ${port}`);
};
initializeDbAndStartServer();
