resource "digitalocean_droplet" "contdel" {
  image = "ubuntu-24-10-x64"
  name = "contdel"
  region = "fra1"
  size = "s-1vcpu-512mb-10gb"
  ssh_keys = [
    data.digitalocean_ssh_key.terraform.id
  ]
  connection {
    host = self.ipv4_address
    user = "root"
    type = "ssh"
    private_key = file(var.pvt_key)
    timeout = "2m"
  }
}