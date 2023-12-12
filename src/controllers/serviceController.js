const ResponseBuilder = require('../helpers/response-builder');
const ServiceServices = require('../services/service');
const ErrorCatcher = require('../helpers/error');

//GET DATA
const getAllService = async (req, res) => {
   try {
     const service = await ServiceServices.getAllServices();
     return ResponseBuilder({ code: 200, data: { service }, message: 'Data Service berhasil diambil' }, res);
   } catch (error) {
     return ResponseBuilder(ErrorCatcher(error), res);
   }
 };

module.exports = {getAllService}