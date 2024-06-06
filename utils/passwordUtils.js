const crypto = require("crypto");

function generatePassword() {
	const minLength = 8;
	const maxLength = 15;
	const length = crypto.randomInt(minLength, maxLength + 1);

	const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
	const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numberChars = "0123456789";
	const allChars = lowercaseChars + uppercaseChars + numberChars;

	let password = "";
	password += lowercaseChars.charAt(crypto.randomInt(0, lowercaseChars.length));
	password += uppercaseChars.charAt(crypto.randomInt(0, uppercaseChars.length));
	password += numberChars.charAt(crypto.randomInt(0, numberChars.length));

	for (let i = 3; i < length; i++) {
		password += allChars.charAt(crypto.randomInt(0, allChars.length));
	}

	password = password
		.split("")
		.sort(() => 0.5 - crypto.randomInt(0, 2))
		.join("");

	return password;
}

module.exports = {
	generatePassword,
};
