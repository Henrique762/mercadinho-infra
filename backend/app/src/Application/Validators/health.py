from src.config.config import db
from sqlalchemy.exc import OperationalError, DBAPIError
from flask import jsonify

def health_test():
    app_status = "healthy"
    db_status = "connected"
    error_message = None

    try:
        # Tenta obter uma conexão do pool e libera-a imediatamente.
        with db.engine.connect() as connection:
            pass # Conexão bem-sucedida
    except (OperationalError, DBAPIError) as e:
        app_status = "unhealthy"
        db_status = "disconnected"
        error_message = f"Database connection failed: {e.orig}"
    except Exception as e:
        app_status = "unhealthy"
        db_status = "disconnected"
        error_message = f"An unexpected error occurred during database check: {str(e)}"

    if app_status == "healthy":
        return jsonify(
            status=app_status,
            database=db_status
        ), 200
    else:
        return jsonify(
            status=app_status,
            database=db_status,
            error=error_message
        ), 500