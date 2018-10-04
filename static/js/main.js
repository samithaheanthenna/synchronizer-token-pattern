$.ajax({
    type: "GET",
    url: "/tokens",
    contentType: "text/json",
    success: function(data) {
        $("#submit-btn").before('<input type="hidden" name="_csrf" value="'+data.token+'">');
    },
    error: function () {
        $("#submit-btn").before('<p>Invalid session</p>');
    }
});