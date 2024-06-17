using Dapper;
using GestorEventos.Servicios.Entidades;
using System.Data.SqlClient;

namespace GestorEventos.Servicios.Servicios
{
    public interface IServicioUsuarios
    {
        string ValidarUsuario(string email);
    }

    public class ServicioUsuarios : IServicioUsuarios
    {
        private string _connectionString;

        public ServicioUsuarios()
        {
            // Connection string para SQL Server
            _connectionString = "Server=tu-servidor.database.windows.net;Database=DespedidaDeSolteros-DB;User Id=usuario;Password=contraseña;";
        }

        public string ValidarUsuario(string email)
        {
            using (SqlConnection db = new SqlConnection(_connectionString))
            {
                // Utilizamos parámetros en la consulta para prevenir SQL injection
                var usuario = db.QueryFirstOrDefault<Usuario>("SELECT * FROM usuarios WHERE Email = @Email", new { Email = email });

                if (usuario == null)
                {
                    return "Usuario Inexistente";
                }
                else
                {
                    if (usuario.tipo_usuario)  
                    {
                        return "Administrador";
                    }
                    else
                    {
                        return "Usuario";
                    }
                }
            }
        }
    }
}
