/**
 *
 * Currently only uses LendingClub. Plan to use more investment platforms in future.
 */

const fs = require('fs');

const resultSet = require('./loans.json').loans;
const myLoans   = require('./my_loans.json').myNotes;

const credible      = require('./modules/credible');
const investorHappy = require('./modules/investor-happy');

// Remove loans already invested in
let loans = resultSet.filter(function(loan) {
	return !myLoans.some(function(loan2) {
		return loan2.loanId === loan.id;
	});
});

// Remove loans in blacklist
loans = loans.filter(function(loan) {
	return !require('./blacklist.json').some(function(id) {
		return loan.id === id;
	});
});

// The loan algorithm to use
loans = credible(loans).map(loan => loan.id);

fs.writeFile('results.json', JSON.stringify(loans, null, "\t"), function(err) {
	if (err) {
		console.error(err);
	} else {
		let len = loans.length;
		console.log(`Found ${len} results, saving to results.json...`);
	}
});
