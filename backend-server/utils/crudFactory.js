// Middleware for checking input
const checkInput = (req, res, next) => {
  const data = req.body;
  const isEmpty = Object.keys(data).length === 0;
  if (isEmpty) {
    return res.status(400).json({
      status: 400,
      message: "Body cannot be empty",
    });
  }
  next();
};

// Factory functions
const createFactory = (elementModel) => async (req, res, next) => {
  console.log("create all factory for", elementModel);
  try {
    const elementDetail = req.body;
    const isEmpty = Object.keys(elementDetail).length === 0;
    if (isEmpty) {
      return res.status(400).json({
        status: 400,
        message: "Body cannot be empty",
      });
    }
    console.log("new data", elementDetail);
    const data = await elementModel.create(elementDetail);
    res.status(201).json({
      status: 201,
      message: "Data created successfully!",
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

const getFactory = (elementModel) => async (req, res, next) => {
  console.log("get all factory for", elementModel);
  try {
    const data = await elementModel.find();
    if (data.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "Data not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Data found",
      data: data,
    });
  } catch (err) {
    next(err);
  }
};

const getFactoryById = (elementModel) => async (req, res,next) => {
  try {
    const { id } = req.params;
    const data = await elementModel.findById(id);
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: "Data not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Data found",
      data: data,
    });
  } catch (err) {
   next(err);
  }
};

const updateFactoryById = (elementModel) => async (req, res, next) => {
  try {
    console.log("request params", req.params);
    const { id } = req.params;
    const data = req.body;
    console.log("dataId", id);
    const updatedData = await elementModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    console.log("updated data", updatedData);
    if (!updatedData) {
      return res.status(404).json({
        status: 404,
        message: "Data not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Data updated successfully",
      data: updatedData,
    });
  } catch (err) {
    next(err);
  }
};

const deleteFactoryById = (elementModel) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedData = await elementModel.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).json({
        status: 404,
        message: "Data not found",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Data deleted successfully",
      data: deletedData,
    });
  } catch (err) {
    next(err);
  }
};

const searchFactoryByParams = (elementModel) => async (req, res, next) => {
  try {
    const sortQuery = req.query.sort;
    const selectQuery = req.query.select;
    const filterQuery = req.query.filter || {};

    let query = elementModel.find(filterQuery);

    // Sorting
    if (sortQuery) {
      const [sortParam, order] = sortQuery.split(" ");
      query = query.sort(order === "asc" ? sortParam : `-${sortParam}`);
    }

    // Selecting fields
    if (selectQuery) {
      query = query.select(selectQuery);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const result = await query.exec();

    res.status(200).json({
      message: "Search successful!",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFactory,
  getFactory,
  getFactoryById,
  updateFactoryById,
  deleteFactoryById,
  checkInput,
  searchFactoryByParams,
};
