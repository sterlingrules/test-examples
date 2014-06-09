
if (window.App == null) {
	window.App = {};
}

window.App.initPositionForm = function() {
	var checkForm, clean_symbol, quoteurl, symbol, updateFundsAllocated;
	$('input, textarea').placeholder();
	$("#position-submit").attr("disabled", "disabled");

	App.setupStockAutoCompleteField("#position_stock", "#position_entry_price");

	if ($('#position_stock').length > 0 && $('#position_stock').val().length > 0) {
		symbol = $('#position_stock').val();
		clean_symbol = symbol.replace(/\./g, ":");
		quoteurl = "/stockquotes/" + clean_symbol + ".json";
		$.get(quoteurl, function(data) {
			var symbol_quote = data[0][symbol],
				change = (symbol_quote["change_points"] > 0 ? "positive" : "negative");
			$(".ticker-details").html("");
			$(".ticker-details").append("<strong>" + symbol + " " + symbol_quote["last_trade"] + " " + "<span class='" + change + "''>" + symbol_quote["change_points"] + " " + symbol_quote["change_percentage"] + "</span>" + "<br /><span class='time small'>" + symbol_quote["market_timestamp"] + " EST</span></strong>");
			$("#position_entry_price").val(symbol_quote["last_trade"]);
			checkForm();
		});
	}
	$('#new_position_placeholder #close-position-dialog').on('click', function() {
		$('#new_position_placeholder').slideUp(200, function() {
			$('#portfolio_subheading').removeClass('entering-position');
		});
		$('#new_position_placeholder').html('');
		$('#new_position_placeholder').attr('style','');
	});
	$('#modal #close-position-dialog').on('click', function() {
		return $.magnificPopup.close();
	});
	var checkForm = function() {
		var fields = '#position_recommendation, #position_entry_size_percentage, #position_expected_return, #position_time_frame, #position_stock';
		return $(fields).each(function() {
			if ($(this).val().length > 0) {
				return $("#position-submit").removeAttr("disabled");
			} else {
				$("#position-submit").attr("disabled", "disabled");
				return false;
			}
		});
	};

	if (document.getElementById('search-ticker-details') != null) {
		$(".ticker-details").hide();
	}

	$('#new_position select').on('change', function() {
		return checkForm();
	});
	$(document).on('keyup', '#new_position input', function() {
		return checkForm();
	});
	$('#position-submit').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		checkForm();
		if (!$('.ticker-details').is(':empty')) {
			$(this).val('Submitting...');
			$(this).attr('disabled', 'disabled');
			return $(this).submit();
		} else {
			return alert('Please select a company from the dropdown');
		}
	});

	var updateFundsAllocated = function() {
		var initialFunds, selectedSize;
		selectedSize = $("#position_entry_size_percentage").val() * 1;
		initialFunds = $('.new_position #funds_allocated').val() * 1;
		$('#funds span').text("" + (initialFunds + selectedSize) + "%");
	};

	updateFundsAllocated();

	$('#position_entry_size_percentage').on('change', updateFundsAllocated);
};

window.App.initClosePositionForm = function() {
	$('#other_closing_reason, #thesis_changed_reason').hide();
	$('.positions input[type=radio]').on('click', function() {
		return $('#other_closing_reason, #thesis_changed_reason').hide();
	});
	$('#other_closing_option').on('click', function() {
		$('#other_closing_reason').removeClass('hidden');
		return $('#other_closing_reason').show();
	});
	return $('#thesis_changed_option').on('click', function() {
		$('#thesis_changed_reason').removeClass('hidden');
		return $('#thesis_changed_reason').show();
	});
};
