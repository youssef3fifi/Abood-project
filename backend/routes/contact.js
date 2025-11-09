const express = require('express');
const router = express.Router();

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // In a real application, you would:
    // - Save to database
    // - Send email notification
    // - Use a service like SendGrid or Nodemailer

    console.log('Contact form submission:', { name, email, subject, message });

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing contact form'
    });
  }
});

module.exports = router;
