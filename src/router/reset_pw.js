const express = require('express');
const connection = require('../database/connection');
const db = require('../database/connection');
const { getOne, create } = require('../variables/query');
const crypto = require('crypto');
const { hashPasswordWithSalt, hashPasswordWithSaltFromDB, encrypt, decrypt } = require('../variables/security');
const { generateRandomCode } = require('../middleware/random_number');
const {
    mailService2
} = require('../services/mail');
const reset_pw_router = express.Router();

reset_pw_router.post('/sendEmail', async (req, res, next) => {
    const {
        emailTo
    } = req.body;
    const isEmailValid = await getOne({
        db,
        query: "SELECT * FROM users WHERE email = ?",
        params: emailTo,
    });


    if (!isEmailValid) {
        res.status(400).json({ message: 'Email not exist' });
    } else {
        const id = isEmailValid.id;
        const code = generateRandomCode();
        const date = new Date(Date.now() + 10 * 60 * 1000);
        const result = await create({
            db,
            query: `UPDATE users
            SET passwordResetToken  = ?, passwordResetExpiration = ?
            WHERE id = ?;`,
            params: [code, date, id]
        });
    try {
        await mailService2.sendEmail(
            {
                emailTo,
                emailSubject: "Reset password",
                emailText: "Your code is " + code + " and it will expire in 10 minutes"
            }
        );
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        res.json({ message: 'Error sending email' });
        console.log(error)
    }
    }
});

reset_pw_router.post('/check', async (req, res, next) => {
    const {
        emailTo,
        passwordResetToken,
        newPassword
    } = req.body;
    // const pwReset = passwordResetToken.toInt();
    const use2 = await getOne({
        db,
        query: 'SELECT passwordResetToken FROM users WHERE email = ? ',
        params: [emailTo],
      });
      console.log(use2);
    const user = await getOne({
        db,
        query: 'SELECT * FROM users WHERE email = ? AND passwordResetToken = ? AND passwordResetExpiration >= ? ',
        params: [emailTo, passwordResetToken, new Date(Date.now())],
      });
    //   console.log(pwReset);
        if (!user) {
            res.status(400).json({ message: 'Invalid code or time expire, pls try again' });
        }
        else 
        {
            const { salt,
                hashedPw } = hashPasswordWithSalt(newPassword);
            const result = await create({
                db,
                query: `UPDATE users
                SET password = ?, salt = ?, passwordResetToken = NULL, passwordResetExpiration = NULL
                WHERE id = ?;`,
                params: [hashedPw, salt, user.id]
            });
            res.status(200).json({ message: 'Reset password successfully' });
        }
});


module.exports = {
    reset_pw_router,
};

