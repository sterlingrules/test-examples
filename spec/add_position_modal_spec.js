jasmine.getFixtures().fixturesPath = 'fixtures';

describe('Add Position modal', function() {
    beforeEach(function() {
        loadFixtures('add_position_modal.html');
        // App.initPositionForm();
    });

    it('#position_stock should start empty', function() {
        expect($('#position_stock')).toHaveValue('');
    });

    it('#position_recommendation should start empty', function() {
        expect($('#position_recommendation option:selected')).toHaveValue('');
    });

    it('#position_entry_size_percentage should start empty', function() {
        expect($('#position_entry_size_percentage option:selected')).toHaveValue('');
    });

    it('#position_expected_return should start empty', function() {
        expect($('#position_expected_return option:selected')).toHaveValue('');
    });

    it('#position_time_frame should start empty', function() {
        expect($('#position_time_frame option:selected')).toHaveValue('');
    });

    it('#position_comment should start empty', function() {
        expect($('#position_comment .position_post')).toHaveValue('');
    });

    it('#position-submit should be disabled', function() {
        expect($('#position-submit')).toBeDisabled();
    });

    it('#position_comment should be focused', function() {
        $('#position_comment .position_post').focus();
        expect($('#position_comment .position_post')).toBeFocused();
    });

    it('#position_comment should be blurred', function() {
        $('#position_comment .position_post').blur();
        expect($('#position_comment .position_post')).not.toBeFocused();
    });

    it('#position-submit should still be visible', function() {
        expect($('#position-submit')).not.toHaveClass('hidden');
    });

    describe('Populating the Add Position modal', function() {
        it('if #position_stock is populated, #position-submit should be disabled', function() {
            $('#position_stock').val('Lorem Ipsum').trigger('keyup');
            expect($('#position-submit')).toBeDisabled();
        });

        it('and #position_recommendation is populated, #position-submit should be disabled', function() {
            $('#position_stock').val('Lorem Ipsum').trigger('keyup');
            $('#position_recommendation').val('value').trigger('change');
            expect($('#position-submit')).toBeDisabled();
        });

        it('and #position_entry_size_percentage is populated, #position-submit should be disabled', function() {
            $('#position_stock').val('Lorem Ipsum').trigger('keyup');
            $('#position_recommendation').val('value').trigger('change');
            $('#position_entry_size_percentage').val('value').trigger('change');
            expect($('#position-submit')).toBeDisabled();
        });

        it('and #position_expected_return is populated, #position-submit should be disabled', function() {
            $('#position_stock').val('Lorem Ipsum').trigger('keyup');
            $('#position_recommendation').val('value').trigger('change');
            $('#position_entry_size_percentage').val('value').trigger('change');
            $('#position_expected_return').val('value').trigger('change');
            expect($('#position-submit')).toBeDisabled();
        });

        xit('and #position_time_frame is populated, #position-submit should be disabled', function() {
            $('#position_stock').val('Lorem Ipsum').trigger('keyup');
            $('#position_recommendation').val('value').trigger('change');
            $('#position_entry_size_percentage').val('value').trigger('change');
            $('#position_expected_return').val('value').trigger('change');
            $('#position_time_frame').val('value').trigger('change');
            expect($('#position-submit')).not.toBeDisabled();
        });

        xit('and #position_comment is populated, #position-submit should be active', function() {
            $('#position_stock').val('Lorem Ipsum').trigger('keyup');
            $('#position_recommendation').val('value').trigger('change');
            $('#position_entry_size_percentage').val('value').trigger('change');
            $('#position_expected_return').val('value').trigger('change');
            $('#position_time_frame').val('value').trigger('change');
            $('#position_comment .position_post').val('value').trigger('keyup');
            expect($('#position-submit')).not.toBeDisabled();
        });
    });
});