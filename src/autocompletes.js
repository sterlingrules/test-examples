
if (!window.App) {
	window.App = {};
}

window.App.setupStockAutoCompleteField = function(inputSelector, outputSelector, userOffsetTop, userOffsetLeft, userOffsetWidth, userSelectHandler) {
	var defaultSelectHandler, inputTriggerName;
	inputTriggerName = inputSelector.substr(1, inputSelector.length);
	$(inputSelector).autocomplete({
		minLength: 1,
		source: "/position_stockquotes.json",
		position: {
			offset: "" + (userOffsetLeft != null ? userOffsetLeft : 0) + " " + (userOffsetTop != null ? userOffsetTop : 0)
		}
	}).data("ui-autocomplete")._renderItem = function(ul, item) {
		var company_name, uniq_symbol;
		if (item.long_name.length > 35) {
			company_name = "" + (item.long_name.substring(0, 35)) + "...";
		} else {
			company_name = item.long_name;
		}
		$('.ui-autocomplete').css('z-index', 9999999);
		uniq_symbol = ul.find("li[data-symbol='" + item.symbol + "']").length === 0;
		if (uniq_symbol) {
			return $("<li data-symbol='" + item.symbol + "' class='ui-menu-item stock-item " + inputTriggerName + "'>").append("<span class='ticker-symbol'>" + item.symbol + "</span>" + "<span class='ticker-name'>" + company_name + "</span>").appendTo(ul);
		} else {
			return $("<li data-symbol='" + item.symbol + "' class='ui-menu-item stock-item " + inputTriggerName + "'>").append("<span class='ticker-symbol'>" + item.symbol + "</span>" + "<span class='ticker-name'>" + company_name + "</span>");
		}
	};
	defaultSelectHandler = function(e, target) {
		var clean_symbol, quoteurl, symbol;
		e.preventDefault();
		symbol = $(target).data('symbol');
		$(inputSelector).val(symbol);
		clean_symbol = symbol.replace(/\./g, ":");
		if (outputSelector) {
			quoteurl = "/stockquotes/" + clean_symbol + ".json";
			$.get(quoteurl, function(data) {
				var change, symbol_quote;
				symbol_quote = data[0][symbol];
				change = (symbol_quote["change_points"] > 0 ? "positive" : "negative");
				$(".ticker-details").html("");
				$(".ticker-details").append(symbol + " " + symbol_quote["last_trade"] + " " + "<span class='" + change + "''>" + symbol_quote["change_points"] + " " + symbol_quote["change_percentage"] + "</span>" + "<br /><span class='time'>" + symbol_quote["market_timestamp"] + " EST</span>");
				return $(outputSelector).val(symbol_quote["last_trade"]);
			});
		}
		return $('.ui-autocomplete').hide();
	};
	return $(".stock-item." + inputTriggerName).live('click', function(e) {
		var target;
		target = $(this);
		if (userSelectHandler) {
			return userSelectHandler(e, target);
		} else {
			return defaultSelectHandler(e, target);
		}
	});
};

window.App.setupSearchAutoCompleteField = function(selector) {
	var displayingType;
	displayingType = '';
	return $(selector).autocomplete({
		minLength: 1,
		source: "/search/autocomplete.json",
		position: {
			offset: "0 21"
		}
	}).data("ui-autocomplete")._renderItem = function(ul, item) {
		var listItem;
		if (item.item_type === 'Post') {
			listItem = "<a href='" + item.url + "'><div class='post-item'>" + item.title + "</div></a>";
		}
		if (item.item_type === 'User') {
			listItem = "<a href='" + item.url + "'><div class='user-item'><img src='" + item.avatar_url + "'><span class='user-name'><strong>" + item.name + "</strong><br>" + (item.bio.slice(0, 59)) + "</span></div></a>";
		}
		if (item.item_type === 'Company') {
			listItem = "<a href='" + item.url + "'><div class='company-item'><img src='" + item.logo_url + "'><span class='company-name'><strong>" + item.name + "</strong><br>" + (item.bio.slice(0, 59)) + "</span></div></a>";
		}
		if (item.item_type === 'Quote') {
			listItem = "<div class='quote-item'><a href='" + item.url + "'><span class='item symbol'>" + item.symbol + " &nbsp;&nbsp;</span><span class='item long_name'>" + item.long_name + "</span></a></div>";
		}
		if (displayingType !== item.item_type) {
			if (item.item_type === 'Post') {
				displayingType = 'Post';
				$('<li class="separator" style="padding-left:20px;padding-bottom:6px;padding-top:6px;color:#363636; background:#ccc; font-weight:bold;">').append("<span>Posts</span><a style='float:right; font-size:11px; font-weight:normal; color:#08c; margin-right:10px' id='execute_post_search'>See only post results &raquo;</a>").appendTo(ul);
			}
			if (item.item_type === 'Quote') {
				displayingType = 'Quote';
				$('<li class="separator" style="padding-left:20px;padding-bottom:6px;padding-top:6px;color:#363636; background:#ccc; font-weight:bold;">').append("<span>Quotes</span>").appendTo(ul);
			}
			if (item.item_type === 'User') {
				displayingType = 'User';
				$('<li class="separator" style="padding-left:20px;padding-bottom:6px;padding-top:6px;color:#363636; background:#ccc; font-weight:bold;">').append("<span>Investors<a style='float:right; font-size:11px; font-weight:normal; color:#08c; margin-right:10px' id='execute_investor_search'>See only investor results &raquo;</a></span>").appendTo(ul);
			}
			if (item.item_type === 'Company') {
				displayingType = 'Company';
				$('<li class="separator" style="padding-left:20px;padding-bottom:6px;padding-top:6px;color:#363636; background:#ccc; font-weight:bold;">').append("<span>Companies</span>").appendTo(ul);
			}
		}
		return $("<li class='ui-menu-item'>").append("<span>" + listItem + "</span>").appendTo(ul);
	};
};

window.App.setupFINRAQualificationsAutoCompleteField = function(selector) {
	$(selector).autocomplete({
		minLength: 1,
		source: "/finra_qualifications.json"
	}).data("ui-autocomplete")._renderItem = function(ul, item) {
		return $("<li data-series='" + item.series + "' class='ui-menu-item finra-qualification-item'>").append("<span class='ticker-symbol'>" + item.series + "</span>" + "<span class='ticker-name wide'>" + item.series_details.substring(0, 55) + "</span>").appendTo(ul);
	};
	return $('.finra-qualification-item').live('click', function(e) {
		var current_qualifications, current_qualifications_string, series;
		e.preventDefault();
		series = $(this).data('series');
		current_qualifications_string = $('#professional_profile_finra_qualifications').val();
		if (current_qualifications_string.length > 0) {
			current_qualifications = current_qualifications_string.split(',');
		} else {
			current_qualifications = [];
		}
		if (current_qualifications.indexOf(series) === -1) {
			$(".qualification-tokens").append("<div class='qualification-token'><span>" + series + ("</span><a class='remove-qualification' data-target-value='" + series + "'>X</a></div>"));
			if (!$(".qualification-tokens").hasClass("clearfix")) {
				$(".qualification-tokens").addClass("clearfix");
			}
			current_qualifications.push(series);
			$('#professional_profile_finra_qualifications').val(current_qualifications.join(","));
			$(selector).val("");
		}
		return $('.ui-autocomplete').hide();
	});
};

window.App.setupFINRAAffiliatedCompaniesAutoCompleteField = function(selector) {
	$(selector).autocomplete({
		minLength: 1,
		source: "/finra_affiliated_companies.json"
	}).data("ui-autocomplete")._renderItem = function(ul, item) {
		return $("<li data-name='" + item.name + "' class='ui-menu-item finra-affiliated-company-item'>").append("<span class='ticker-symbol wide'>" + item.name + "</span>").appendTo(ul);
	};
	return $('.finra-affiliated-company-item').live('click', function() {
		$(selector).val($(this).data('name'));
		return $('.ui-autocomplete').hide();
	});
};
