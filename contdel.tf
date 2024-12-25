resource "digitalocean_droplet" "contdel" {
  image  = "ubuntu-24-10-x64"
  name   = "contdel"
  region = "fra1"
  size   = "s-2vcpu-8gb-160gb-intel"
  ssh_keys = [
    data.digitalocean_ssh_key.terraform.id
  ]
  connection {
    host        = self.ipv4_address
    user        = "root"
    type        = "ssh"
    private_key = file(var.pvt_key)
    timeout     = "5m"
  }

  provisioner "local-exec" {
    command = <<EOT
      ansible-playbook -i "inventory.ini" setup.yml --extra-vars "ansible_host=${self.ipv4_address} ansible_user=root ansible_ssh_private_key_file=${var.pvt_key}"
    EOT
  }

}
