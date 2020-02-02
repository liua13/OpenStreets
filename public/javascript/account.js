function switchAccount(account){
	if(account=="login"){
		$("#signup-wrapper").hide();
		$("#login-wrapper").show();
	} else {
		$("#login-wrapper").hide();
		$("#signup-wrapper").show();
	}
}