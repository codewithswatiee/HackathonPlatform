from flask import Flask
from flask_cors import CORS
from routes import chatbot_bp, schedule_bp, evaluation_bp
from routes.organiser_chatbot_route import organizer_bp
from routes.user_chatbot_route import user_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Register blueprints
app.register_blueprint(chatbot_bp, url_prefix='/api')
app.register_blueprint(organizer_bp, url_prefix='/api/organizer')
app.register_blueprint(schedule_bp, url_prefix='/api/schedule')
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(evaluation_bp, url_prefix='/api/evaluation')

@app.route('/')
def index():
    return "Hackathon Chatbot API is running!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 