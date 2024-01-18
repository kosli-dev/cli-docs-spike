from flask import redirect, render_template, url_for


def register_routes(app_blueprint):

    @app_blueprint.route('/')
    def home():
        return redirect(url_for('app.demo'))

    @app_blueprint.route('/demo', methods=['GET'])
    def demo():
        return render_template('demo.html')
