from flask import redirect, render_template, url_for


def register_routes(app_blueprint):

    @app_blueprint.route('/')
    def home():
        return redirect(url_for('app.demo_github'))

    @app_blueprint.route('/demo_github', methods=['GET'])
    def demo_github():
        return render_template('demo_github.html')

    @app_blueprint.route('/demo_gitlab', methods=['GET'])
    def demo_gitlab():
        return render_template('demo_gitlab.html')
