from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)
DB_NAME = "creditos.db"

def init_db():
    """Inicializa la base de datos y crea la tabla si no existe."""
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS creditos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente TEXT NOT NULL,
                monto REAL NOT NULL,
                tasa_interes REAL NOT NULL,
                plazo INTEGER NOT NULL,
                fecha_otorgamiento TEXT NOT NULL
            )
        ''')
        conn.commit()

@app.route('/')
def home():
    """Renderiza la página principal."""
    return render_template('index.html')

@app.route('/api/creditos', methods=['GET'])
def get_creditos():
    """Devuelve la lista de créditos en formato JSON."""
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM creditos")
        creditos = cursor.fetchall()
    return jsonify([
        {"id": row[0], "cliente": row[1], "monto": row[2], "tasa_interes": row[3], "plazo": row[4], "fecha_otorgamiento": row[5]}
        for row in creditos
    ])

@app.route('/api/creditos', methods=['POST'])
def add_credito():
    """Registra un nuevo crédito en la base de datos."""
    data = request.json
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO creditos (cliente, monto, tasa_interes, plazo, fecha_otorgamiento)
            VALUES (?, ?, ?, ?, ?)
        """, (data['cliente'], data['monto'], data['tasa_interes'], data['plazo'], data['fecha_otorgamiento']))
        conn.commit()
    return jsonify({"message": "Crédito agregado correctamente"}), 201

@app.route('/api/creditos/<int:credito_id>', methods=['PUT'])
def update_credito(credito_id):
    """Actualiza un crédito existente."""
    data = request.json
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE creditos SET cliente=?, monto=?, tasa_interes=?, plazo=?, fecha_otorgamiento=?
            WHERE id=?
        """, (data['cliente'], data['monto'], data['tasa_interes'], data['plazo'], data['fecha_otorgamiento'], credito_id))
        conn.commit()
    return jsonify({"message": "Crédito actualizado correctamente"})

@app.route('/api/creditos/<int:credito_id>', methods=['DELETE'])
def delete_credito(credito_id):
    """Elimina un crédito por su ID."""
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM creditos WHERE id=?", (credito_id,))
        conn.commit()
    return jsonify({"message": "Crédito eliminado correctamente"})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
