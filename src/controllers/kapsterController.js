// src/controllers/kapsterController.js
const { object, string } = require('yup');
const ResponseBuilder = require('../helpers/response-builder');
const ErrorCatcher = require('../helpers/error');
const KapsterService = require('../services/kapster');


export const createKapsters = async (
  /** @type {{ body: any; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
const kapsterSchema = object({
  name: string().required('Nama harus diisi'),
  gender: string().required('Gender harus diisi'),
  specialization: string().required('Specialization harus diisi'),
});
try {
  const body = req.body
  await kapsterSchema.validate(body)
  await KapsterService.createKapster(req.body);
  return ResponseBuilder(
    {
      code: 201,
      message: 'Kapster successfully created.',
      data: null,
    },
    res)
} catch (error) {
  // @ts-ignore
  return ResponseBuilder(ErrorCatcher(error), res)
}
}

// READ ALL
export const getAllKapster = async (_,res) => {
  try {
    const kapsters = await KapsterService.getKapsters();

    return ResponseBuilder(
      {
        code: 200,
        data: kapsters,
        message: 'Data Kapster berhasil diambil.',
      },
      res,
    );
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error), res);
  }
};

module.exports = {
  createKapsters,
  getAllKapster,
};
