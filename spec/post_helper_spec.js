jasmine.getFixtures().fixturesPath = 'fixtures';

describe('Post blur event', function() {

    beforeEach(function() {
        loadFixtures('post_helper.html');
    });

    it('Check if parent exists', function() {
        expect($('#header')).toBeVisible();
    });

    it('Parent should already be blurred', function() {
        expect(PostHelper.handleBlur('#header')).toBe(false);
    });

    xit('Parent should start focused with empty fields and blur', function() {
        $('#header').addClass('entering-post');
        expect(PostHelper.handleBlur('#header')).toBe(undefined);
    });

    it('Parent should start focused with populated title field', function() {
        $('#header').addClass('entering-post');
        $('#post_title').val('Lorem Ipsum');
        expect(PostHelper.handleBlur('#header')).toBe(false);
    });

    it('Parent should start focused with populated content field', function() {
        $('#header').addClass('entering-post');
        $('#post_content').val('Lorem Ipsum');
        expect(PostHelper.handleBlur('#header')).toBe(false);
    });

    it('Parent should start focused with populated content and title field', function() {
        $('#header').addClass('entering-post');
        $('#post_title').val('Lorem Ipsum');
        $('#post_content').val('Lorem Ipsum');
        expect(PostHelper.handleBlur('#header')).toBe(false);
    });
});