FROM httpd:2.4

# Définir le répertoire de travail (utile uniquement pour les commandes RUN)
WORKDIR /app

# Copier l'archive de l'application
COPY *.tar.gz .

# Extraire les fichiers vers le dossier web d’Apache et supprimer l’archive
RUN for file in *.tar.gz; do \
      tar -xzf "$file" --strip-components=1 -C /usr/local/apache2/htdocs/ && \
      rm "$file"; \
    done

# Modifier httpd.conf pour :
# - définir ServerName localhost
# - charger les modules proxy nécessaires
# - inclure le dossier conf.d pour les vhosts (où tu placeras vhost-api.conf)
RUN sed -i '/^#LoadModule proxy_module/s/^#//' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/^#LoadModule proxy_http_module/s/^#//' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/^#LoadModule proxy_connect_module/s/^#//' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/^#LoadModule proxy_ajp_module/s/^#//' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/^#LoadModule proxy_fcgi_module/s/^#//' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/^#LoadModule proxy_wstunnel_module/s/^#//' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/^#LoadModule rewrite_module/s/^#//' /usr/local/apache2/conf/httpd.conf && \
    grep -q '^Include conf/conf.d/\*\.conf' /usr/local/apache2/conf/httpd.conf || echo 'Include conf/conf.d/*.conf' >> /usr/local/apache2/conf/httpd.conf

# Créer le dossier conf.d s’il n’existe pas (pour les vhosts personnalisés)
RUN mkdir -p /usr/local/apache2/conf/conf.d

# Copier le fichier de configuration de vhost (reverse proxy) dans conf.d
COPY vhost-api.conf /usr/local/apache2/conf/conf.d/vhost-api.conf

# Exposer le port 80 d’Apache
EXPOSE 80

# Lancer Apache en mode premier plan
CMD ["httpd-foreground"]

