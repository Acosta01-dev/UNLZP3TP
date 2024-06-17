using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GestorEventos.Servicios.Entidades
{
    public class Usuario
    {
        public string email { get; set;}
        // FALSE = No es administrador, TRUE = Es administrador
        public bool tipo_usuario { get; set;}
    }
}
