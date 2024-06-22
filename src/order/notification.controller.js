const express = require('express');
const router = express.Router();
const { updateStatusBasedOnMidtransResponse } = require('./order.service.js');

router.post('/', async (req, res) => {
  const data = req.body;
  const response = await updateStatusBasedOnMidtransResponse(
    data.order_id,
    data,
  );

  if (response.status === 'error') {
    return res.status(400).json({
      status: 'FAIL',
      message: 'OK',
      data: response,
    });
  }
  return res.status(200).json({
    status: 'success',
    message: 'OK',
    data: response,
  });
});

module.exports = router;
